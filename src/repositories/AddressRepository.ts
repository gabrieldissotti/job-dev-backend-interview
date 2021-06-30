/* eslint-disable camelcase */
import { AddressDTO } from '@interfaces/AddressDTO'
import AddressEntity from '@entities/AddressEntity'
import AppRepository from './AppRepository'

export default class AddressRepository extends AppRepository {
  constructor () {
    const { table, schema } = AddressEntity

    super({ table, schema })
  }

  public async create (
    data: Omit<AddressDTO, 'id'>
  ): Promise<AddressDTO> {
    const {
      neighborhood,
      number,
      postalCode: postal_code,
      street,
      restaurantId: restaurant_id
    } = data

    const result = await this.save({
      neighborhood,
      number,
      postal_code,
      street,
      restaurant_id
    })

    const address = new AddressEntity(result[0])

    return address
  }
}
