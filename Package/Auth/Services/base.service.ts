export default abstract class BaseService<T> {

  public model: T;
  constructor(baseModel: T) {
    this.model = baseModel;
  }

  async getOne(pk: string): Promise<T> {
    return this.model;
  }

  async getAll(): Promise<T[]> {
    return [];
  }

  async create(payload: Partial<T>): Promise<T> {
    return this.model;
  }

  async update(pk: string, payload: Partial<T>): Promise<T> {
    return this.model;
  }

  async deleteByPK(pk: string): Promise<any> {
    return this.model;
  }
}
