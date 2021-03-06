import * as redis from 'redis'

import Logger from '@libraries/Logger'

import {
  redisPort,
  redisHost,
  redisCacheDefaultDurationTime
} from '@configs/app'
class Redis {
  public client?: redis.RedisClient
  public logger: Logger
  public isReadyToUse: boolean;

  constructor () {
    this.client = undefined
    this.logger = new Logger('app')

    this.isReadyToUse = false

    this.connect()
  }

  public connect () {
    this.logger.info('connecting to redis server')
    try {
      this.client = redis.createClient({
        host: redisHost,
        port: redisPort,
        connect_timeout: 4000,
        max_attempts: 5
      })
      this.assignObservers()
    } catch (error) {
      this.logger.error(error)
    }
  }

  private assignObservers () {
    this.client?.on('connect', () =>
      this.logger.info('redis connection successfully')
    )

    this.client?.on('ready', () => {
      this.isReadyToUse = true
      this.logger.info('redis ready to be used')
    })

    this.client?.on('reconnecting', () =>
      this.logger.info('trying to reconnect with redis')
    )

    this.client?.on('error', (error: any) => {
      if (typeof error === 'string' &&
        error.includes('The connection is already closed')
      ) {
        this.isReadyToUse = false
      }
      this.logger.error('redis: ' + error)
    })
    this.client?.on('end', () => this.logger.info('redis end'))
  }

  public saveInRedis (key: string, data: any) {
    if (!this.isReadyToUse) {
      return
    }

    const actualDate = new Date()
    const invalidationAt = new Date().setMinutes(
      actualDate.getMinutes() + 1
    )

    const dataToCache = {
      cache: {
        updated_at: actualDate,
        invalidation_at: new Date(invalidationAt)
      },
      data
    }

    this.logger.info(`saving ${key} in redis`)

    this.client?.setex(
      key,
      Number(redisCacheDefaultDurationTime),
      JSON.stringify(dataToCache)
    )
  }
}

export default new Redis()
