import { type NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // ?title=<title>
    const hasNumbers = searchParams.has("numbers");
    const numbers: {
      value: number;
      used: boolean;
    }[][] = hasNumbers ? JSON.parse(searchParams.get("numbers") as string) : [];

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
          }}
        >
          <div tw="flex flex-col items-center gap-4">
            {numbers.map((row, i) => (
              <div key={i} tw="flex gap-4">
                {row.map((col, j) => (
                  <div
                    key={j}
                    tw={`${
                      col.used ? "bg-pink-400" : "bg-white/10"
                    } flex h-12 w-12 items-center justify-center rounded-md`}
                  >
                    {col.value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ),
      {
        width: 500,
        height: 500,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
