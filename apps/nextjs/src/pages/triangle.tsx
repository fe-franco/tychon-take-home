import {
  createRef,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { zoom as D3zoom, select, zoomIdentity, type D3ZoomEvent } from "d3";

import { api } from "~/utils/api";

const useZoom = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    if (!ref.current) return;
    const container = select<HTMLDivElement, unknown>(ref.current);
    const child = container.select("div");

    const handleZoom = (event: D3ZoomEvent<HTMLDivElement, unknown>) => {
      const { transform } = event;
      child.style(
        "transform",
        `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
      );
      child.style("transform-origin", "0 0");
    };

    const zoomBehavior = D3zoom<HTMLDivElement, unknown>()
      .scaleExtent([0.1, 5])
      .extent([
        [0, 0],
        [ref.current.clientWidth, ref.current.clientHeight],
      ])
      .on("zoom", handleZoom);

    container.call(zoomBehavior);

    // Set initial zoom level and center the canvas
    const initialScale = 1;
    const initialTranslate = [0, 0];
    container.call(
      zoomBehavior.transform,
      zoomIdentity
        .scale(initialScale)
        .translate(initialTranslate[0] ?? 0, initialTranslate[1] ?? 0),
    );

    // Clean up zoom behavior on unmount
    return () => {
      container.on(".zoom", null);
    };
  }, [ref]);
};

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
  const { mutate, data } = api.triangle.maxValuePath.useMutation();
  const [triangle, setTriangle] = useState<string>("");
  const zoomRef = createRef<HTMLDivElement>();

  useZoom(zoomRef);

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

          <h2 className={`text-2xl font-bold text-pink-400`}>
            Enter the triangle
          </h2>
          <span>{/* {t.x} {t.y} {t.k} */}</span>

          <div
            className={`flex h-96 w-96 items-center justify-center  overflow-hidden rounded-md bg-white/10`}
            ref={zoomRef}
          >
            <div className={`flex rounded-md bg-white/10 p-5`} ref={zoomRef}>
              <div className={`flex h-max w-max flex-col items-center gap-4`}>
                <TriangleInput triangle={triangle} setTriangle={setTriangle} />
              </div>
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

const TriangleInput = ({
  triangle,
  setTriangle,
}: {
  triangle: string;
  setTriangle: Dispatch<SetStateAction<string>>;
}) => {
  const numbers = useMemo(() => getNumbers(triangle), [triangle]);

  const updateValue = ({
    value,
    row,
    col,
  }: {
    value: string;
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

  return (
    <>
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
    </>
  );
};

export default Triangle;
