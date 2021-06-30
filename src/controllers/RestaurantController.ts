import { Request, Response, NextFunction } from 'express'
import { container } from 'tsyringe'

import RestaurantRepository from '@repositories/RestaurantRepository'
import CreateRestaurantService from '@services/CreateRestaurantService'
import CreateRestaurantValidator from '@validators/CreateRestaurantValidator'
import AddressRepository from '@repositories/AddressRepository'

class RestaurantController {
  public async store (request: Request, response: Response, next: NextFunction) {
    try {
      const bodyParams = new CreateRestaurantValidator(request.body)
      await bodyParams.validate()
      const expectedParams = bodyParams.getExpectedParams()

      const restaurantsRepository = container.resolve(RestaurantRepository)
      const addressRepository = container.resolve(AddressRepository)

      const createRestaurantService = new CreateRestaurantService(
        restaurantsRepository,
        addressRepository
      )

      const restaurantWithAddress = await createRestaurantService.execute(
        expectedParams
      )

      return response.json(restaurantWithAddress)
    } catch (error) {
      next(error)
    }
  }
}

export default new RestaurantController()
