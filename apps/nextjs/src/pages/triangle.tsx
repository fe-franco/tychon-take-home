import { createRef, useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { set } from "zod";

import { api } from "~/utils/api";

const getNumbers = (triangle: string) => {
  const rows = triangle.split("\n");
  return rows.map((row) => {
    const cells = row.split(" ");
    return cells.map((cell) => ({
      value: cell.split("-")[0],
      used: cell.split("-")[1] === "used",
      ref: createRef<HTMLInputElement>(),
    }));
  });
};

const Triangle: NextPage = () => {
  const { mutate, data, isLoading } = api.triangle.maxValuePath.useMutation();
  const [triangle, setTriangle] = useState<string>("");
  const numbers = useMemo(() => getNumbers(triangle), [triangle]);

  const updateValue = ({
    value,
    row,
    col,
  }: {
    value: string;
    used: boolean;
    row: number;
    col: number;
  }) => {
    // update the value
    setTriangle((prev) => {
      const newTriangle: string[][] = [
        ...prev
          .split("\n")
          .map((row) =>
            row.split(" ").map((cell) => `${cell.split("-")[0]}-unused`),
          ),
      ];

      if (newTriangle[row])
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        newTriangle[row]![col] = `${value.trim().split("-")[0]}-unused`;

      return newTriangle.map((row) => row.join(" ")).join("\n");
    });
  };

  const keyInput = ({
    value,
    row,
    col,
  }: {
    value: string;
    row: number;
    col: number;
  }) => {
    if (value === "Enter" || value === "Space") {
      if (!numbers[row]?.[col]?.value) return;

      if (col === (numbers?.[row]?.length ?? 0) - 1) setFocus(row + 1, 0);

      if (col < (numbers[row]?.length ?? 0) - 1) setFocus(row, col + 1);
    }
  };

  const onFocus = (row: number, col: number) => {
    if (col === (numbers[row]?.length ?? 0) - 1 && row === numbers.length - 1) {
      createNewRow(row + 1);
    }
  };

  const createNewRow = (row: number) => {
    // create new row with empty value and the number of columns equal to the row number
    const newRow = Array.from({ length: row + 1 }, () => ({
      value: "",
      used: false,
      ref: createRef<HTMLInputElement>(),
    }));

    // add new row to the triangle
    setTriangle((prev) => {
      const newTriangle: string[][] = [
        ...prev.split("\n").map((row) => row.split(" ")),
      ];
      newTriangle[row] = newRow.map(({ value }) => value);
      return newTriangle.map((row) => row.join(" ")).join("\n");
    });
  };

  const setFocus = (row: number, col: number) => {
    numbers?.[row]?.[col]?.ref.current?.focus();
  };

  useEffect(() => {
    if (data) {
      setTriangle((prev) => {
        const newTriangle: string[][] = [
          ...prev.split("\n").map((row) => row.split(" ")),
        ];
        data?.usedCells.forEach(({ row, col }) => {
          if (newTriangle[row])
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            newTriangle[row]![col] = `${
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              newTriangle[row]![col]?.trim().split("-")[0]
            }-used`;
        });
        return newTriangle.map((row) => row.join(" ")).join("\n");
      });
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>{`Tychon Take Home | Triangle`}</title>
        <meta name="description" content={`Tychon Take Home | Triangle`} />
        <link rel="icon" href={`/favicon.ico`} />
      </Head>
      <main
        className={`flex h-full min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white`}
      >
        <div
          className={`container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8`}
        >
          <h1
            className={`text-5xl font-extrabold tracking-tight sm:text-[5rem]`}
          >
            Triangle Max Value Path Calculation
          </h1>

          <div className={`flex flex-col gap-4`}>
            <h2 className={`text-2xl font-bold text-pink-400`}>
              Enter the triangle
            </h2>

            {/* {JSON.stringify(triangle)}
            {JSON.stringify(data)} */}

            <div className={`flex flex-col items-center gap-4`}>
              {numbers.map((row, i) => (
                <div key={i} className={`flex gap-4`}>
                  {row.map(({ value, used, ref }, j) => (
                    <input
                      contentEditable={true}
                      type="number"
                      key={j}
                      ref={ref}
                      className={`resize-none overflow-hidden rounded-md ${
                        used ? "bg-pink-400" : "bg-white/10"
                      } h-12 w-12 text-center font-semibold text-white no-underline transition hover:bg-white/20`}
                      value={value}
                      onKeyDownCapture={(e) => {
                        keyInput({
                          value: e.key === " " ? "Space" : e.key,
                          row: i,
                          col: j,
                        });
                      }}
                      onChange={(e) => {
                        updateValue({
                          value: e.target.value,
                          used,
                          row: i,
                          col: j,
                        });
                      }}
                      required
                      onFocus={() => {
                        onFocus(i, j);
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button
            className={`rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20`}
            onClick={() => {
              mutate(triangle);
            }}
          >
            Calculate
          </button>
        </div>
      </main>
    </>
  );
};

export default Triangle;
