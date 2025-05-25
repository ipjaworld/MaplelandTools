// pages/Presets.tsx
import React from "react";
import { Bookmark } from "lucide-react";

const Presets: React.FC = () => {
  const scrollPresets = [
    { name: "10% 공격력 주문서", probability: 10, category: "공격력" },
    { name: "15% 공격력 주문서", probability: 15, category: "공격력" },
    { name: "30% 공격력 주문서", probability: 30, category: "공격력" },
    { name: "60% 공격력 주문서", probability: 60, category: "공격력" },
    { name: "70% 공격력 주문서", probability: 70, category: "공격력" },
    { name: "10% 마력 주문서", probability: 10, category: "마력" },
    { name: "15% 마력 주문서", probability: 15, category: "마력" },
    { name: "30% 마력 주문서", probability: 30, category: "마력" },
    { name: "60% 마력 주문서", probability: 60, category: "마력" },
    { name: "70% 마력 주문서", probability: 70, category: "마력" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          주문서 프리셋
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          자주 사용하는 메이플스토리 주문서들의 확률이 미리 설정되어 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scrollPresets.map((preset, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {preset.category}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {preset.name}
            </h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {preset.probability}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Presets;