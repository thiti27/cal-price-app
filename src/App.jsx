import { useState, useEffect } from "react";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

const subMenus = [
  { key: "bottle", image: "/1.png" },
  { key: "ice", image: "/2.png" },
  { key: "pour", image: "/3.png" },
];

const menuData = [
  {
    name: "ชาใต้",
    image: "/1-1.png",
    prices: { bottle: 25, ice: 30, pour: 20 },
  },
  {
    name: "ชาเขียว",
    image: "/1-2.png",
    prices: { bottle: 25, ice: 30, pour: 20 },
  },
  {
    name: "ช็อกโก้",
    image: "/1-3.png",
    prices: { bottle: 30, ice: 35, pour: 25 },
  },
  {
    name: "โอเลี้ยง",
    image: "/1-4.png",
    prices: { bottle: 20, ice: 25, pour: 15 },
  },
  {
    name: "เก็กฮวย",
    image: "/1-5.png",
    prices: { bottle: 20, ice: 25, pour: 15 },
  },
];

export default function App() {
  const [cart, setCart] = useState(
    () => JSON.parse(localStorage.getItem("cart")) || {}
  );
  const [cash, setCash] = useState("");

  const format = (num) => new Intl.NumberFormat("th-TH").format(num);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const add = (menu, type, price) => {
    const key = `${menu}-${type}`;
    setCart((p) => ({
      ...p,
      [key]: { name: menu, price, qty: (p[key]?.qty || 0) + 1 },
    }));
  };

  const remove = (key) => {
    setCart((p) => {
      const qty = (p[key]?.qty || 0) - 1;
      if (qty <= 0) {
        const c = { ...p };
        delete c[key];
        return c;
      }
      return { ...p, [key]: { ...p[key], qty } };
    });
  };

  const total = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  const change = Math.max((Number(cash) || 0) - total, 0);

  const press = (v) => {
    if (v === "C") return setCash("");
    if (v === "←") return setCash((p) => p.slice(0, -1));
    setCash((p) => p + v);
  };

  const clearAll = () => {
    setCart({});
    setCash("");
  };

  // 🔥 รวมจำนวนในแต่ละ column
  const getColTotal = (type) => {
    return Object.entries(cart)
      .filter(([k]) => k.includes(`-${type}`))
      .reduce((sum, [, v]) => sum + v.qty, 0);
  };

  return (
    // 🔥 THEME ใหม่: soft cream + glass + modern POS (layout เดิม แต่สวยขึ้นมาก)

    <div className="h-screen flex bg-gradient-to-br from-[#fdfcf9] to-[#f3f4f6] font-sarabun text-gray-800">
      {/* LEFT */}
      <div className="w-2/3 p-6 overflow-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-4">
          <table className="w-full text-center">
            {/* HEADER */}
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="p-3">เมนู</th>

                {subMenus.map((s, i) => (
                  <th key={i} className="p-3">
                    <img
                      src={s.image}
                      className="w-12 h-16 mx-auto drop-shadow-sm"
                    />

                    {/* TOTAL PER COL */}
                    <div className="mt-2 flex flex-col items-center">
                      <span className="text-2xl font-extrabold text-indigo-600 leading-none">
                        {getColTotal(s.key)}
                      </span>
                      <span className="text-[10px] text-gray-400">แก้ว</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {menuData.map((menu, i) => (
                <tr key={i} className="border-t border-gray-100">
                  {/* MENU */}
                  <td className="p-3">
                    <div className="flex flex-col items-center gap-1">
                      <img
                        src={menu.image}
                        className="w-12 h-12 rounded-xl shadow-sm"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {menu.name}
                      </span>
                    </div>
                  </td>

                  {subMenus.map((sub, j) => {
                    const key = `${menu.name}-${sub.key}`;
                    const qty = cart[key]?.qty || 0;
                    const price = menu.prices[sub.key];

                    return (
                      <td key={j} className="p-2">
                        <div
                          onClick={() => add(menu.name, sub.key, price)}
                          className={`
                        rounded-2xl p-3 cursor-pointer transition-all duration-150
                        ${
                          qty > 0
                            ? "bg-indigo-500 text-white shadow-md scale-[1.02]"
                            : "bg-gray-50 hover:bg-indigo-50"
                        }
                      `}
                        >
                          <div className="flex justify-center items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                remove(key);
                              }}
                              className="bg-white/20 w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur"
                            >
                              <FiMinus size={14} />
                            </button>

                            <span className="font-bold text-lg w-6 text-center">
                              {qty}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                add(menu.name, sub.key, price);
                              }}
                              className="bg-white/20 w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-1/3 flex flex-col p-6 gap-4">
        {/* MONEY */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border p-4">
          <div className="grid grid-cols-3 text-center items-center">
            <div>
              <p className="text-xs text-gray-400">รับเงิน</p>
              <p className="text-2xl font-bold text-gray-700">
                {format(cash || 0)}
              </p>
            </div>

            <div className="bg-indigo-500 text-white rounded-2xl py-4 shadow-md">
              <p className="text-xs opacity-80">รวม</p>
              <p className="text-3xl font-extrabold">{format(total)}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">เงินทอน</p>
              <p className="text-2xl font-bold text-emerald-500">
                {format(change)}
              </p>
            </div>
          </div>
        </div>

        {/* KEYPAD */}
        <div className="grid grid-cols-3 gap-3">
          {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "←", "C"].map(
            (n) => (
              <button
                key={n}
                onClick={() => press(n)}
                className="bg-white/80 backdrop-blur rounded-2xl py-5 text-lg font-semibold shadow hover:shadow-lg active:scale-95 transition"
              >
                {n}
              </button>
            )
          )}
        </div>

        {/* CLEAR */}
        <button
          onClick={clearAll}
          className="w-full bg-gradient-to-r from-red-500 to-red-400 text-white
                 py-5 rounded-2xl text-lg font-bold shadow-lg
                 hover:scale-[1.02] active:scale-95 transition"
        >
          ล้างทั้งหมด
        </button>
      </div>
    </div>
  );
}
