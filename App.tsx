
import React, { useState, useMemo } from 'react';
import { 
  getCanChi, 
  getLunarDate, 
  HOANG_DAO, 
  GIO_TEN, 
  GIO_KHUNG,
  checkAgeCompatibility
} from './lunarUtils';

enum Tab {
  DAY = 'DAY',
  MONTH = 'MONTH',
  CHECK = 'CHECK'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DAY);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [birthYear, setBirthYear] = useState<number>(1995);
  const [purpose, setPurpose] = useState<string>("Khai trương");

  const dateData = useMemo(() => {
    const d = currentDate.getDate();
    const m = currentDate.getMonth() + 1;
    const y = currentDate.getFullYear();
    const canChi = getCanChi(d, m, y);
    const lunar = getLunarDate(d, m, y);
    const compatibility = checkAgeCompatibility(birthYear, { day: d, month: m, year: y });
    const isHoangDao = ["Tý", "Dần", "Mão", "Ngọ", "Mùi", "Dậu"].includes(canChi.dayChiOnly);
    
    return { canChi, lunar, compatibility, isHoangDao };
  }, [currentDate, birthYear]);

  const changeDay = (offset: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + offset);
    setCurrentDate(d);
  };

  const renderDayView = () => (
    <div className="flex flex-col items-center px-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="calendar-card w-full max-w-sm overflow-hidden relative border border-white shadow-2xl">
        <div className="bg-gradient-to-r from-red-700 to-red-600 w-full text-white text-center py-4">
          <div className="text-sm font-bold opacity-80 tracking-widest uppercase">Tháng {currentDate.getMonth() + 1}</div>
          <div className="text-2xl font-playfair tracking-wider">{currentDate.getFullYear()}</div>
        </div>
        
        <div className="flex flex-col items-center py-10 bg-white">
          <div className="text-[120px] font-playfair leading-none text-gray-900 font-bold tracking-tighter drop-shadow-sm">
            {currentDate.getDate()}
          </div>
          <div className="text-red-600 font-bold uppercase tracking-[0.2em] text-sm mt-2">
            {new Intl.DateTimeFormat('vi-VN', { weekday: 'long' }).format(currentDate)}
          </div>
        </div>

        <div className="bg-gray-50/80 border-t border-gray-100 px-6 py-6 grid grid-cols-2 gap-4">
          <div className="text-center border-r border-gray-200">
            <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Âm lịch</div>
            <div className="text-2xl font-bold text-gray-800">{dateData.lunar.day}</div>
            <div className="text-[10px] text-red-600 font-bold uppercase">Tháng {dateData.lunar.month}</div>
          </div>
          <div className="flex flex-col justify-center pl-2">
            <div className="text-[11px] font-bold text-gray-700">Ngày {dateData.canChi.day}</div>
            <div className="text-[11px] text-gray-500">Tháng {dateData.canChi.month}</div>
            <div className="text-[11px] text-gray-500">Năm {dateData.canChi.year}</div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm mt-6 grid grid-cols-2 gap-3">
        <div className={`p-4 rounded-2xl border ${dateData.isHoangDao ? 'bg-yellow-50 border-yellow-100' : 'bg-gray-50 border-gray-100'}`}>
          <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Loại ngày</div>
          <div className={`font-bold text-sm ${dateData.isHoangDao ? 'text-yellow-700' : 'text-gray-600'}`}>
            {dateData.isHoangDao ? '🌟 Hoàng Đạo' : '🌑 Hắc Đạo'}
          </div>
        </div>
        <div className={`p-4 rounded-2xl border ${dateData.compatibility.bg} border-opacity-50`}>
          <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Hợp tuổi {birthYear}</div>
          <div className={`font-bold text-sm ${dateData.compatibility.color}`}>
            {dateData.compatibility.text}
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-gray-800 font-bold text-sm flex items-center gap-2 mb-4">
          <span className="w-1.5 h-4 bg-red-600 rounded-full"></span>
          Giờ Hoàng Đạo (Tốt)
        </h3>
        <div className="flex flex-wrap gap-2">
          {GIO_TEN.filter(gio => HOANG_DAO[dateData.canChi.dayChiOnly as keyof typeof HOANG_DAO]?.includes(gio)).map((gio, idx) => (
            <div key={idx} className="bg-red-50 text-red-700 px-3 py-2 rounded-xl text-[11px] font-bold border border-red-100">
              {gio}: {GIO_KHUNG[GIO_TEN.indexOf(gio)]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCheckView = () => (
    <div className="px-4 pt-4 animate-in slide-in-from-right duration-300 space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Xem ngày theo tuổi</h2>
        <p className="text-xs text-gray-400 mb-6 font-medium">Chọn tuổi & mục đích để nhận tư vấn phong thủy cá nhân.</p>
        
        <div className="space-y-5">
          <div className="relative group">
            <label className="text-[10px] uppercase font-bold text-gray-400 absolute -top-2.5 left-3 bg-white px-1 z-10">Năm sinh của bạn</label>
            <div className="relative">
              <input 
                type="number" 
                value={birthYear} 
                onChange={(e) => setBirthYear(parseInt(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 font-bold text-gray-700 focus:ring-4 focus:ring-red-500/5 focus:bg-white focus:border-red-500 outline-none transition-all"
                placeholder="Ví dụ: 1990"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">Tuổi {(new Date().getFullYear()) - birthYear}</span>
            </div>
          </div>

          <div className="relative">
            <label className="text-[10px] uppercase font-bold text-gray-400 absolute -top-2.5 left-3 bg-white px-1 z-10">Mục đích công việc</label>
            <select 
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 font-bold text-gray-700 focus:ring-4 focus:ring-red-500/5 focus:bg-white focus:border-red-500 outline-none appearance-none transition-all cursor-pointer"
            >
              {["Xuất hành", "Khai trương", "Ký kết", "Cưới hỏi", "Động thổ", "Xây dựng", "Về nhà mới"].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
        </div>

        <div className={`mt-8 p-6 rounded-3xl ${dateData.compatibility.bg} border border-dashed border-gray-200 flex flex-col items-center transition-all duration-500`}>
          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">Kết quả phân tích</div>
          <div className={`text-4xl font-bold ${dateData.compatibility.color} drop-shadow-sm`}>{dateData.compatibility.score}%</div>
          <div className="text-sm font-bold text-gray-800 mt-2 uppercase tracking-wide">{dateData.compatibility.text}</div>
          
          <div className="w-full bg-gray-200/50 h-2 rounded-full mt-6 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${dateData.compatibility.score > 70 ? 'bg-green-500' : dateData.compatibility.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
              style={{ width: `${dateData.compatibility.score}%` }}
            ></div>
          </div>
          
          <p className="mt-6 text-[11px] text-gray-500 text-center leading-relaxed">
            Hệ thống dựa trên <span className="font-bold text-gray-700">Ngũ Hành - Tam Hợp - Lục Xung</span> để tính toán. <br/>
            Đối với việc <span className="font-bold text-red-600 uppercase underline decoration-2 underline-offset-4">{purpose}</span>, ngày này được xem là <span className="font-bold text-gray-700">{dateData.compatibility.text.toLowerCase()}</span>.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <span className="w-1.5 h-4 bg-red-600 rounded-full"></span>
            Giờ tốt nhất cho {purpose}
          </h3>
          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">GMT+7</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {GIO_TEN.filter(gio => HOANG_DAO[dateData.canChi.dayChiOnly as keyof typeof HOANG_DAO]?.includes(gio)).map((gio, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-red-100 hover:bg-red-50/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-red-600 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                  {gio[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">Giờ {gio}</div>
                  <div className="text-[10px] text-gray-400 font-medium">{GIO_KHUNG[GIO_TEN.indexOf(gio)]}</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Đại Cát
                </div>
                <div className="text-[9px] text-gray-400 italic">Thanh Long</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMonthView = () => (
    <div className="px-4 pt-4 animate-in zoom-in-95 duration-300">
       <div className="bg-white rounded-3xl p-4 shadow-xl border border-gray-50">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="font-bold text-xl text-gray-800">Tháng {currentDate.getMonth() + 1} / {currentDate.getFullYear()}</h2>
            <div className="flex gap-1">
              <button onClick={() => {
                const d = new Date(currentDate);
                d.setMonth(d.getMonth() - 1);
                setCurrentDate(d);
              }} className="p-2 bg-gray-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg></button>
              <button onClick={() => {
                const d = new Date(currentDate);
                d.setMonth(d.getMonth() + 1);
                setCurrentDate(d);
              }} className="p-2 bg-gray-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg></button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-4">
            {["Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "CN"].map(d => (
              <div key={d} className={`text-[10px] font-bold uppercase ${d === 'CN' ? 'text-red-500' : 'text-gray-400'}`}>{d}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => {
              const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
              const startDay = firstDayOfMonth.getDay();
              const offset = startDay === 0 ? 6 : startDay - 1;
              const day = i - offset + 1;
              
              const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
              
              if (day < 1 || day > daysInMonth) return <div key={i} className="h-14"></div>;
              
              const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
              const isSelected = day === currentDate.getDate();

              return (
                <button 
                  key={i} 
                  onClick={() => {
                    const d = new Date(currentDate);
                    d.setDate(day);
                    setCurrentDate(d);
                  }}
                  className={`h-14 flex flex-col items-center justify-center rounded-2xl transition-all ${isSelected ? 'bg-red-600 text-white shadow-lg' : isToday ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <span className="text-sm font-bold">{day}</span>
                  <span className={`text-[8px] font-medium opacity-60 ${isSelected ? 'text-white' : ''}`}>
                    {getLunarDate(day, currentDate.getMonth()+1, currentDate.getFullYear()).day}
                  </span>
                </button>
              );
            })}
          </div>
       </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto relative min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-playfair tracking-tight">Lịch Thông Minh</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Giao diện cá nhân hóa</p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => changeDay(-1)} className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-xl active:scale-95 transition-transform">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 h-9 bg-red-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-tighter active:scale-95 transition-transform shadow-md shadow-red-200">
            Hôm nay
          </button>
          <button onClick={() => changeDay(1)} className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-xl active:scale-95 transition-transform">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </header>

      <main>
        {activeTab === Tab.DAY && renderDayView()}
        {activeTab === Tab.MONTH && renderMonthView()}
        {activeTab === Tab.CHECK && renderCheckView()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 glass-nav h-20 px-8 flex items-center justify-between z-50 max-w-md mx-auto shadow-2xl rounded-t-[32px]">
        <button onClick={() => setActiveTab(Tab.DAY)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.DAY ? 'text-red-600' : 'text-gray-400'}`}>
          <div className={`p-1.5 rounded-lg ${activeTab === Tab.DAY ? 'bg-red-50' : ''}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
          <span className="text-[9px] font-bold uppercase tracking-tighter">Ngày</span>
        </button>
        
        <button onClick={() => setActiveTab(Tab.CHECK)} className="relative -top-6 group">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 group-active:scale-90 ${activeTab === Tab.CHECK ? 'bg-red-600 rotate-0 shadow-red-200' : 'bg-gray-800 rotate-3'}`}>
             <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <span className={`block text-center mt-2 text-[9px] font-bold uppercase tracking-tighter ${activeTab === Tab.CHECK ? 'text-red-600' : 'text-gray-400'}`}>Tư vấn tuổi</span>
        </button>

        <button onClick={() => setActiveTab(Tab.MONTH)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.MONTH ? 'text-red-600' : 'text-gray-400'}`}>
          <div className={`p-1.5 rounded-lg ${activeTab === Tab.MONTH ? 'bg-red-50' : ''}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg></div>
          <span className="text-[9px] font-bold uppercase tracking-tighter">Tháng</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
