import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PAGES } from "./pages";

const numberOfWordsSchema = z.coerce
  .number({
    invalid_type_error: "数字を入力してください",
    required_error: "入力必須です",
  })
  .int("整数値を入力してください")
  .min(1, "1以上にしてください")
  .max(2027, "2027以下にしてください");

const schema = z.object({
  numberOfWords: numberOfWordsSchema,
});

type Schema = z.infer<typeof schema>;

function App() {
  const [startNumber, setStartNumber] = useState<number>();
  const [numberOfWords, setNumberOfWords] = useState<number>();
  const [mode, setMode] = useState<number>();

  const endNumber =
    startNumber && numberOfWords && startNumber + numberOfWords - 1;
  const startPage = startNumber && PAGES[startNumber];
  const endPage = endNumber && PAGES[endNumber];

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Schema>({
    mode: "onBlur",
    resolver: zodResolver(schema),
    defaultValues: { numberOfWords: 100 },
  });

  const handleRaffle = handleSubmit(({ numberOfWords }) => {
    const max = 2027 + 1 - numberOfWords;
    setStartNumber(Math.floor(Math.random() * max + 1));
    setNumberOfWords(numberOfWords);
    setMode(Math.round(Math.random()));
  });

  return (
    <div className="bg-base-200 w-full min-h-screen" data-theme="">
      <div className="navbar bg-base-300">
        <h1 className="font-bold text-xl w-full max-w-sm mx-auto">
          シス単抽選アプリ
        </h1>
      </div>

      <div className="m-4 w-full max-w-sm mx-auto">
        <h2 className="font-bold text-xl">抽選設定</h2>

        <div className="form-control w-full max-w-xs">
          <label className="label">単語数</label>
          <input
            type="number"
            className={`input ${
              errors.numberOfWords && "input-error"
            } input-bordered w-full max-w-xs`}
            {...register("numberOfWords", { valueAsNumber: true })}
          />
          {errors.numberOfWords && (
            <label className="label text-error">
              {errors.numberOfWords.message}
            </label>
          )}
        </div>

        <div className="my-4">
          <button className="btn btn-primary" onClick={handleRaffle}>
            抽選する！
          </button>
        </div>

        <h2 className="font-bold text-xl my-2">抽選結果</h2>

        <div className="stats stats-vertical shadow w-full">
          <div className="stat">
            <div className="stat-title">単語番号</div>
            <div className="stat-value flex items-center">
              {startNumber}
              <span className="mx-1 text-xl">～</span>
              {endNumber}
            </div>
            <div className="stat-desc">
              pp. {startPage}～{endPage}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">学習方法</div>
            <div className="stat-value flex items-center">
              {mode !== undefined && ["英語", "日本語"][mode]}
              <span className="mx-1 text-xl">→</span>
              {mode !== undefined && ["日本語", "英語"][mode]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
