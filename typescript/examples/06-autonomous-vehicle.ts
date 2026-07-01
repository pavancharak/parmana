import {
  AuthorityType,
  BusinessTransaction,
  BusinessTransactionStatus,
  HttpTransport,
  ParmanaClient,
} from "@parmana/typescript-sdk";

const client =
  new ParmanaClient({
    endpoint:
      "http://localhost:3000",

    transport:
      new HttpTransport({
        endpoint:
          "http://localhost:3000",
      }),
  });

const businessTransactionId =
  crypto.randomUUID();

const transaction: BusinessTransaction = {
  businessTransactionId,

  metadata: {
    businessTransactionId,
    correlationId:
      "autonomous-vehicle-demo",
    sourceSystem:
      "typescript-sdk-example",
    submittedBy:
      "vehicle-controller",
    submittedAt:
      new Date(),
  },

  authority: {
    authorityId:
      "authority-av-001",
    authorityType:
      AuthorityType.SERVICE,
    principalId:
      "vehicle-controller",
    displayName:
      "Autonomous Vehicle Controller",
    issuedAt:
      new Date(),
  },

  authorization: {
    authorizationId:
      "authorization-av-001",
    authorityId:
      "authority-av-001",
    purpose:
      "Authorize autonomous navigation",
    issuedAt:
      new Date(),
  },

  intent: {
    intentId:
      "intent-av-001",
    authorizationId:
      "authorization-av-001",
    action:
      "NavigateVehicle",
    target:
      "vehicle/AV-001",
    parameters: {
      destination:
        "Warehouse-A",
    },
    createdAt:
      new Date(),
  },

  policy: {
    name:
      "autonomous-driving",
    version:
      "1.0.0",
    schemaVersion:
      "1.0.0",
  },

  signals: {
    lidarHealthy: true,
    gpsHealthy: true,
    routeVerified: true,
    emergencyStopAvailable: true,
  },

  status:
    BusinessTransactionStatus.RECEIVED,

  createdAt:
    new Date(),
};

const trustRecord =
  await client.execute(
    transaction,
  );

console.log(
  JSON.stringify(
    trustRecord,
    null,
    2,
  ),
);