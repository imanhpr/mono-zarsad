import { FastifyInstance } from "fastify";
import {
  GetLatestPriceListQuery,
  GetLatestPriceListQuerySchema,
} from "./schema.ts";

export default async function getLatestCurrencyByTypeIdPlugin(
  fastify: FastifyInstance
) {
  const service = fastify.currencyManageService;

  fastify.get<{ Querystring: GetLatestPriceListQuery }>(
    "/latest",
    {
      preHandler: fastify.adminJwtBearerAuth,
      schema: {
        querystring: GetLatestPriceListQuerySchema,
        tags: ["admin/currency", "admin"],
      },
    },
    async function getLatestCurrencyHandler(req) {
      const { currencyTypeId, limit, orderBy } = req.query;
      const limitNumber = Math.abs(parseInt(limit));
      const currencyTypeIdNumber = Math.abs(parseInt(currencyTypeId));
      const limitValue = limitNumber >= 50 ? 50 : limitNumber;

      const result = await service.getLatestPriceLimit(
        currencyTypeIdNumber,
        limitValue,
        orderBy
      );
      return result;
    }
  );
}
