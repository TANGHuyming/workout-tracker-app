import { NextRequest } from "next/server";

export const getJwtPayload = (request: NextRequest) => {
  const jwtPayloadHeader = request.headers.get("jwt-payload");

  if (!jwtPayloadHeader) {
    return { success: false, message: "Unauthorized: No JWT payload" };
  }

  const payload = JSON.parse(jwtPayloadHeader);
  return payload;
};
