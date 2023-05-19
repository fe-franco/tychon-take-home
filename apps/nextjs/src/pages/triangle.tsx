import { createRef, useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { validateInput } from "~/validations/triangle";

const Triangle: NextPage = () => {
  const { mutate, data, isLoading } = api.triangle.maxValuePath.useMutation();
  const [triangle, setTriangle] = useState<string>("");

  const [numbers, setNumbers] = useState<
    {
      value: string;
      used: boolean;
      ref: React.RefObject<HTMLInputElement>;
    }[][]
  >([
    [
      {
        value: "",
        used: false,
        ref: createRef<HTMLInputElement>(),
      },
    ],
    [
      {
        value: "",
        used: false,
        ref: createRef<HTMLInputElement>(),
      },
      {
        value: "",
        used: false,
        ref: createRef<HTMLInputElement>(),
      },
    ],
  ]);

  const handleInput = ({
    value,
    used,
    row,
    col,
  }: {
    value: string;
    used: boolean;
    row: number;
    col: number;
  }) => {
    if (!validateInput(value)) return;

    setNumbers((prev) => {
      const newNumbers = [...prev];
      newNumbers[row]![col] = {
        value: value.trim(),
        used,
        ref: prev[row]?.[col]?.ref || createRef<HTMLInputElement>(),
      };
      return newNumbers;
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
      // check inf current cell is empty
      if (numbers[row]?.[col]?.value === "") {
        return;
      }
      // if the current input is the last input in the row, then move to the first input in the next row
      if (col === (numbers[row]?.length ?? 0) - 1) {
        numbers[row + 1]?.[0]?.ref.current?.focus();
      }
      // if the current input is not the last input in the row, then move to the next input in the row
      if (col < (numbers[row]?.length ?? 0) - 1) {
        numbers[row]?.[col + 1]?.ref.current?.focus();
      }
      return;
    }
  };

  const onFocus = (row: number, col: number) => {
    // if the user presses enter, tab or space, then move to the next input
    // check if the current input is the second to last input in the row and it is the last row
    if (col === (numbers[row]?.length ?? 0) - 1 && row === numbers.length - 1) {
      // if the current input is the second to last input in the row, then add a new row with the same amount of inputs as the row number
      setNumbers((prev) => {
        const newNumbers = [...prev];
        newNumbers.push(
          [...Array(row + 2)].map(() => ({
            value: "",
            used: false,
            ref: createRef<HTMLInputElement>(),
          })),
        );
        return newNumbers;
      });
    }
  };

  return (
    <>
      <Head>
        <title>Tychon Take Home | Triangle</title>
        <meta name="description" content="Tychon Take Home | Triangle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Triangle Max Value Path Calculation
          </h1>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-pink-400">
              Enter the triangle
            </h2>

            {/* create a input box for the ammount of inputs variable */}
            <div className="flex flex-col items-center gap-4">
              {...numbers.map((row, i) => (
                <div key={i} className="flex gap-4">
                  {row.map((cell, j) => (
                    <input
                      contentEditable={true}
                      key={j}
                      ref={cell.ref}
                      className={`resize-none overflow-hidden rounded-md ${
                        cell.used ? "bg-pink-400" : "bg-white/10"
                      } h-20 w-20 text-center font-semibold text-white no-underline transition hover:bg-white/20`}
                      value={cell.value}
                      onKeyDownCapture={(e) => {
                        keyInput({
                          value: e.key === " " ? "Space" : e.key,
                          row: i,
                          col: j,
                        });
                      }}
                      onChange={(e) => {
                        handleInput({
                          value: e.target.value,
                          used: cell.used,
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

          {/* button to calculate the max value path */}
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => {
              mutate(triangle);
            }}
          >
            Calculate
          </button>

          {/* display the result */}
          <div className="flex flex-col gap-4">
            {/* max sum path */}
            <h2 className="text-2xl font-bold text-pink-400">Max Sum Path</h2>
            <textarea
              className="w-96 rounded-md bg-white/10 px-5 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              value={data?.sum}
              readOnly
            />
            {/* color the numbers used in the path from the input */}
            <h2 className="text-2xl font-bold text-pink-400">
              Numbers used in the path
            </h2>
            <div className="flex flex-col items-center gap-4">
              {data?.numbers.map((row, i) => (
                <div key={i} className="flex gap-4">
                  {row.map((col, j) => (
                    <div
                      key={j}
                      className={`${
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
        </div>
      </main>
    </>
  );
};

export default Triangle;
