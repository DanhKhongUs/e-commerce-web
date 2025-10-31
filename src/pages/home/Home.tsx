export default function Home() {
  return (
    <section className="relative  w-full overflow-hidden bg-gradient-to-br from-gray-700 via-gray-500 to-gray-300 pt-4">
      <div className=" flex relative overflow-hidden z-10">
        <div className="flex-1 h-[778px] relative z-20 flex flex-col gap-8 pl-4 lg:pl-16 pt-20">
          <img
            src="logoEV.png"
            alt="Logo"
            className="h-30 w-48 xl:flex hidden"
          />
          <p className="text-[#86f9b3] tracking-widest text-lg ml-10 mt-10">
            WE ARE GUEST
          </p>
          <h1 className="text-5xl xl:text-7xl leading-tight text-gray-200 mb-48 xl:mb-60 w-full ml-4">
            Second hand EV & <br /> Battery Trading Platform
          </h1>
        </div>

        <div
          className="absolute right-60 bottom-60 opacity-10"
          style={{
            backgroundImage: `url(
              "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTJweCIgaGVpZ2h0PSIxMnB4IiB2aWV3Qm94PSIwIDAgMTIgMTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU1LjIgKDc4MTgxKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5kb3QgZ3JpZDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJEZXNrdG9wIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iMS4wX0hvbWUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MTUuMDAwMDAwLCAtMjE2Ni4wMDAwMDApIiBmaWxsPSIjRTZFQUVEIj4KICAgICAgICAgICAgPGcgaWQ9ImRvdC1ncmlkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MTUuMDAwMDAwLCAyMTY2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiPjwvY2lyY2xlPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
            )`,
            backgroundRepeat: "repeat",
            width: "700px",
            height: "500px",
          }}
        />

        <div
          className="absolute top-40 right-[-30rem] w-[1200px] h-[896px] hidden 2xl:flex items-center justify-center pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <div className="absolute animate-spinSlow">
            <img
              src="icon.svg"
              alt="circle-1"
              className="w-[550px] h-[550px]"
            />
          </div>
          <img
            src="greendot.svg"
            alt="dot-1"
            className="absolute top-0 left-0 -z-10 translate-x-[335px] translate-y-[33%] w-[550px] h-[550px]"
          />
          <div className="absolute animate-spinSlow">
            <img
              src="icon.svg"
              alt="circle-2"
              className="w-[730px] h-[730px] "
            />
          </div>
          <img
            src="greendot.svg"
            alt="dot-1"
            className="absolute top-0 left-0 -z-10 translate-x-[245px] translate-y-[13%] w-[730px] h-[730px]"
          />
          <div className="absolute animate-spinSlow">
            <img
              src="icon.svg"
              alt="circle-3"
              className="w-[910px] h-[910px] "
            />
          </div>
          <img
            src="greendot.svg"
            alt="dot-1"
            className="absolute top-0 left-0 -z-10 translate-x-[160px] translate-y-[1%] w-[910px] h-[910px]"
          />
        </div>
      </div>
    </section>
  );
}
