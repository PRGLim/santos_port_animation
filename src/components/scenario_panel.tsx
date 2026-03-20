'use client'

type Props = {
  name: string;
};

export default function ScenarioPanel({ name }: Props) {
  return (
    <div className=" fixed right-4 bottom-15 z-50 flex justify-center items-center p-6">
      <div className="bg-white rounded-2xl shadow-md px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {name}
        </h2>
      </div>
    </div>
  )
}