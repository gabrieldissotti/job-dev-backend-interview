/* eslint-disable camelcase */
import { WorkingHourToRestaurantDTO, WorkingHourToPromotionDTO } from '@interfaces/WorkingHourDTO'
import WorkingHourEntity from '@entities/WorkingHourEntity'
import AppRepository from './AppRepository'
import { Weekday } from '@interfaces/Weekday'

export default class WorkingHourRepository extends AppRepository {
  constructor () {
    const { table, schema } = WorkingHourEntity

    super({ table, schema })
  }

  public async createManyToRestaurant (
    data: WorkingHourToRestaurantDTO[]
  ): Promise<WorkingHourToRestaurantDTO[]> {
    const parsedData = data.map(day => ({
      weekday: day.weekday,
      start_at: day.startAt.toString(),
      finish_at: day.finishAt.toString(),
      restaurant_id: day.restaurantId
    }))

    const results = await this.save(parsedData)

    const workingHours = results.map((day: any) =>
      new WorkingHourEntity(day))

    return workingHours
  }

  public async createManyToPromotion (
    data: Array<{
      weekday: Weekday;
      startAt: string;
      finishAt: string;
      promotionId: string;
    }>

  ): Promise<WorkingHourToPromotionDTO[]> {
    const parsedData = data.map(day => ({
      weekday: day.weekday,
      start_at: day.startAt.toString(),
      finish_at: day.finishAt.toString(),
      promotion_id: day.promotionId
    }))

    const results = await this.save(parsedData)

    const workingHours = results.map((day: any) =>
      new WorkingHourEntity(day))

    return workingHours
  }
}
