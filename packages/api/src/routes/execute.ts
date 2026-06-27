import { Router } from "express";

import { RuntimeFactory } from "@parmana/runtime";

import {
  businessTransactionRepository,
  executionTrustRecordRepository,
} from "../repositories.js";

const router = Router();

const runtime =
  RuntimeFactory.create(
    businessTransactionRepository,
    executionTrustRecordRepository
  );

/**
 * Returns true when the value is a UUID.
 */
function isValidBusinessTransactionId(
  value: unknown
): value is string {

  return (

    typeof value === "string" &&

    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )

  );

}

router.post(
  "/",
  async (req, res) => {

    console.log(
      "POST /execute reached"
    );

    try {

      const {
        businessTransactionId,
      } = req.body;

      if (
        !isValidBusinessTransactionId(
          businessTransactionId
        )
      ) {

        return res
          .status(400)
          .json({

            error:
              "businessTransactionId must be a valid UUID.",

          });

      }

      const result =
        await runtime.execute(
          req.body
        );

      res.json(
        result
      );

    } catch (err) {

      console.error(
        "POST /execute failed"
      );

      console.error(
        err
      );

      res.status(500).json({

        error:
          err instanceof Error
            ? err.message
            : "Unknown error",

        stack:
          err instanceof Error
            ? err.stack
            : undefined,

      });

    }

  }
);

export default router;