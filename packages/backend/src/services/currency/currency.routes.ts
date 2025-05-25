import { FastifyInstance, RouteGenericInterface } from "fastify";

interface NewCurrencyPriceRequestBody {
  currencyId: number;
  price: string;
}
interface GetCurrencyPriceListQuery {
  currency?: string | string[];
  isJalali?: string | string[];
}
export default function currencyRoutesPlugin(
  fastify: FastifyInstance,
  _: Record<string, unknown>,
  done: (err?: Error) => void
) {
  const hasService = fastify.hasDecorator("currencyService");
  if (!hasService) throw new Error("Please init currencyService");

  const service = fastify.currencyService;
  fastify.get<{ Querystring: GetCurrencyPriceListQuery }>(
    "/",
    { schema: { tags: ["currency"] } },
    function getCurrencyList(req) {
      const { currency, isJalali } = req.query;
      return service.findCurrencyPriceByCurrencyTypeId(
        parseInt(currency as string),
        isJalali === "true" ? true : false
      );
    }
  );
  fastify.post<{ Body: NewCurrencyPriceRequestBody }>(
    "/",
    { schema: { tags: ["currency"] } },
    async function newCurrencyPrice(req) {
      const { currencyId, price } = req.body;
      const result = await service.insertNewCurrencyPrice({
        currencyId,
        price,
      });
      return result;
    }
  );
  done();
}
