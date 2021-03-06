import { inject, injectable } from 'tsyringe'

import RestaurantRepository from '@repositories/RestaurantRepository'
import ProductRepository from '@repositories/ProductRepository'

import HttpException from '@exceptions/HttpException'

import { FindAllProductsResponseDTO } from '@interfaces/ProductDTO'
import { RestaurantDTO } from '@interfaces/RestaurantDTO'

type RequestDTO = {
  page: number;
  pagesize: number;
}

@injectable()
class ListProductsService {
  constructor (
    @inject('RestaurantRepository')
    private restaurantRepository: RestaurantRepository,

    @inject('ProductRepository')
    private productRepository: ProductRepository
  ) { }

  public async execute (
    paginationFilters: RequestDTO,
    restaurantId: string
  ): Promise<FindAllProductsResponseDTO> {
    const restaurant: RestaurantDTO =
      await this.restaurantRepository.findOne({
        where: {
          id: restaurantId
        }
      })

    if (!restaurant) {
      throw new HttpException(404, 'Restaurant not found')
    }

    const products: FindAllProductsResponseDTO =
      await this.productRepository.findAllProducts({
        ...paginationFilters,
        restaurantId
      })

    return products
  }
}

export default ListProductsService
