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

  const getColTotal = (type) => {
    return Object.entries(cart)
      .filter(([k]) => k.includes(`-${type}`))
      .reduce((sum, [, v]) => sum + v.qty, 0);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f9fafb] font-sarabun text-gray-800">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 p-4 sm:p-6">
        <div className="bg-white rounded-3xl shadow-md p-6">
          {/* HEADER */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="flex items-center justify-center">
              <img
                src="/logo.png"
                className="w-60 h-40 object-contain -ml-10"
              />
            </div>

            {subMenus.map((s) => (
              <div key={s.key} className="text-center">
                <img
                  src={s.image}
                  className="w-14 h-16 mx-auto object-contain"
                />

                <p className="text-xs text-gray-400 mt-1">
                  {menuData[0].prices[s.key]} ฿
                </p>

                <div className="mt-1 px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
                  <p className="text-xl font-bold text-orange-600">
                    {getColTotal(s.key)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* LIST */}
          <div className="flex flex-col gap-3 -mt-5">
            {menuData.map((menu, idx) => (
              <div
                key={menu.name}
                className={`
      grid grid-cols-4 gap-3 items-center rounded-2xl px-2 py-2
      transition-all
      ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
      border border-transparent hover:border-gray-200
    `}
              >
                {/* MENU */}
                <div className="flex items-center gap-3">
                  <img
                    src={menu.image}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <span className="text-sm font-semibold text-gray-800">
                    {menu.name}
                  </span>
                </div>

                {/* BUTTONS */}
                {subMenus.map((sub) => {
                  const key = `${menu.name}-${sub.key}`;
                  const qty = cart[key]?.qty || 0;

                  return (
                    <div
                      key={key}
                      onClick={() =>
                        add(menu.name, sub.key, menu.prices[sub.key])
                      }
                      className={`
            h-[64px] rounded-2xl flex items-center justify-between px-3
            cursor-pointer transition-all border
            ${
              qty > 0
                ? "bg-orange-50 border-orange-200 shadow-sm"
                : "bg-white border-gray-200 hover:bg-gray-100"
            }
            active:scale-[0.97]
          `}
                    >
                      {/* - */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(key);
                        }}
                        className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center"
                      >
                        <FiMinus size={14} />
                      </button>

                      {/* qty */}
                      <span className="text-lg font-bold text-gray-900">
                        {qty}
                      </span>

                      {/* + */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          add(menu.name, sub.key, menu.prices[sub.key]);
                        }}
                        className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* RIGHT */}

      <div className="w-full lg:w-1/3 p-4 sm:p-6 flex flex-col gap-4">
        {/* 🔥 MONEY (จัดใหม่ทั้งหมด) */}
        <div className="bg-white rounded-3xl shadow-md border p-5">
          {/* 🔥 TOTAL (soft highlight ไม่แข็ง) */}
          <div
            className="bg-orange-50 border border-orange-200 
                  rounded-2xl py-6 text-center mb-4"
          >
            <p className="text-xs text-orange-400 tracking-wide">ยอดรวม</p>

            <p className="text-5xl font-extrabold text-orange-600 tracking-wide">
              {format(total)}
            </p>
          </div>

          {/* 🔥 CASH + CHANGE */}
          <div className="flex gap-3">
            {/* CASH */}
            <div className="flex-1 bg-gray-50 rounded-2xl py-4 text-center">
              <p className="text-xs text-gray-400">รับเงิน</p>

              <p className="text-2xl font-semibold text-gray-800">
                {format(cash || 0)}
              </p>
            </div>

            {/* CHANGE */}
            <div className="flex-1 bg-green-50 rounded-2xl py-4 text-center">
              <p className="text-xs text-green-400">เงินทอน</p>

              <p className="text-2xl font-semibold text-green-600">
                {format(change)}
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 KEYPAD */}
        <div className="grid grid-cols-3 gap-3">
          {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "←", "C"].map(
            (n) => (
              <button
                key={n}
                onClick={() => press(n)}
                className="bg-white border border-gray-200 
                   rounded-2xl py-5 text-lg font-semibold
                   shadow-sm hover:bg-gray-50
                   active:scale-95 transition"
              >
                {n}
              </button>
            )
          )}
        </div>

        {/* 🔥 CLEAR */}
        <button
          onClick={clearAll}
          className="w-full bg-red-100 text-red-600 
               py-5 rounded-2xl text-lg font-semibold
               hover:bg-red-200 active:scale-95 transition"
        >
          <div className="flex items-center justify-center gap-2">
            <FiTrash2 size={18} />
            ล้างรายการ
          </div>
        </button>
      </div>
    </div>
  );
}
