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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f9fafb] text-gray-800 font-sarabun">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-4">
          <table className="w-full text-center">
            {/* HEADER */}
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="p-3">เมนู</th>

                {subMenus.map((s, i) => (
                  <th key={i} className="p-3">
                    <img src={s.image} className="w-12 h-16 mx-auto" />

                    <div className="mt-2">
                      <div className="text-2xl font-extrabold text-orange-500">
                        {getColTotal(s.key)}
                      </div>
                      <div className="text-[10px] text-gray-400">แก้ว</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {menuData.map((menu, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">
                    <img
                      src={menu.image}
                      className="w-12 h-12 mx-auto rounded-xl"
                    />
                    <p className="text-sm">{menu.name}</p>
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
                        rounded-2xl p-3 transition cursor-pointer border
                        ${
                          qty > 0
                            ? "bg-orange-500 text-white shadow-md scale-[1.02]"
                            : "bg-gray-50 hover:bg-orange-50 border-gray-200"
                        }
                      `}
                        >
                          <div className="flex justify-center items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                remove(key);
                              }}
                              className="bg-white/70 w-8 h-8 rounded-xl flex items-center justify-center shadow"
                            >
                              <FiMinus />
                            </button>

                            <span className="font-bold text-lg">{qty}</span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                add(menu.name, sub.key, price);
                              }}
                              className="bg-white/70 w-8 h-8 rounded-xl flex items-center justify-center shadow"
                            >
                              <FiPlus />
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
      <div className="w-full lg:w-1/3 p-6 flex flex-col gap-4">
        {/* MONEY */}
        <div className="bg-white rounded-3xl shadow-xl border p-5">
          <div className="grid grid-cols-3 text-center items-center">
            <div>
              <p className="text-xs text-gray-400">รับเงิน</p>
              <p className="text-2xl font-bold">{format(cash || 0)}</p>
            </div>

            {/* 🔥 TOTAL (เด่นสุด) */}
            <div className="bg-orange-500 text-white rounded-2xl py-4 shadow-lg">
              <p className="text-xs opacity-80">รวม</p>
              <p className="text-3xl font-extrabold tracking-wider">
                {format(total)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">เงินทอน</p>
              <p className="text-2xl font-bold text-green-500">
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
                className="bg-white border border-gray-200
                     rounded-2xl py-5 text-lg font-bold
                     shadow hover:bg-gray-50 active:scale-95"
              >
                {n}
              </button>
            )
          )}
        </div>

        {/* CLEAR */}
        <button
          onClick={clearAll}
          className="bg-red-500 text-white py-5 rounded-2xl font-bold shadow-lg active:scale-95"
        >
          ล้างทั้งหมด
        </button>
      </div>
    </div>
  );
}
