import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);

  async function getCourses() {
    try {
      const response = await axios.get(
        "https://development.studiokode.co/api/public/course-list"
      );
      let data = response.data.list;
      setCategories(response.data.tech_opt);
      data.forEach((el) => {
        el.price = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(el.price);
        el.price = el.price.slice(0, el.price.length - 3);
        el.duration = el.duration / 60;
        el.tech = el.tech.sort()
      });
      data = data.filter((el) =>
        el.course.toLowerCase().includes(search.toLowerCase())
      );
      if (currentCategories.length !== 0) {
        for (let i = 0; i < currentCategories.length; i++) {
          data = data.filter((el) => el.tech.includes(currentCategories[i]))
        }
      }
      setCourses(data);
    } catch (error) {}
  }

  function handleCheckedCategory(value, status) {
    let data = currentCategories;
    if (status) {
      data.push(Number(value));
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i] === Number(value)) {
          data.splice(i, 1);
        }
      }
    }
    data.sort()
    setCurrentCategories(data);
    getCourses();
  }

  useEffect(() => {
    getCourses();
  }, [search]);
  return (
    <>
      <form className="px-10 my-5">
        <div className="relative">
          <svg
            className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type={"text"}
            value={search}
            placeholder="Cari kelas"
            className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>
      <div className="flex flex-row space-x-2">
        <div className="w-3/12 rounded-md border h-fit py-4 px-2">
          <h1 className="font-medium text-md text-center">Filter Pencarian</h1>
          <div className="border-b mx-4 my-6"></div>
          {categories.map((category) => (
            <div className="flex flex-row items-center space-x-2 py-2">
              <input
                className="cat20 checked:bg-sky-400"
                type={"checkbox"}
                value={category.value}
                onChange={(e) =>
                  handleCheckedCategory(e.target.value, e.target.checked)
                }
              />
              <label className="text-slate-500">{category.text}</label>
            </div>
          ))}
        </div>
        <div className="flex-1 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div className="flex flex-col space-y-4 rounded-lg bg-slate-100" >
                <img className="w-full rounded-tl-lg rounded-tr-lg" src={course.program_img} />
                <div className="px-2 py-4">
                <h1 className="text-sky-400 text-lg font-semibold pb-2">
                  {course.course}
                </h1>
                <h1 className="text-slate-500 pb-2">
                  {course.age_start} - {course.age_end} Tahun -{" "}
                  {course.duration} Jam
                </h1>
                <h1 className="text-sky-400 text-md">{course.price}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
