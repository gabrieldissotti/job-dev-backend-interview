export default class RestaurantEntity {
  public static table: string = 'restaurants';
  public static schema: string = 'public';

  public id: string
  public name: string
  public photoUrl: string

  public createdAt: Date;
  public updatedAt: Date;

  constructor (result: any) {
    this.id = String(result.id)
    this.name = String(result.name)
    this.photoUrl = String(result.photo_url)

    this.createdAt = new Date(result.created_at)
    this.updatedAt = new Date(result.updated_at)
  }
}
