import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MusicalNoteIcon } from "@heroicons/react/24/outline";
import yorushikaLogo from "../assets/yorushika.png";
import yorushikaGIF from "../assets/YORUSHIKAA.gif";
import yorushikaSVG from "../assets/yorushika.svg";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/20 to-transparent dark:from-indigo-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-100/20 to-transparent dark:from-amber-900/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      {/* Floating Musical Notes */}
      <div className="hidden md:block absolute top-40 right-12 opacity-20 dark:opacity-10">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <MusicalNoteIcon className="h-16 w-16 text-neutral-400 dark:text-neutral-600" />
        </motion.div>
      </div>

      {/* Welcome Section */}
      <section className="relative pt-44">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-transparent dark:from-neutral-900 dark:to-transparent z-0" />

        {/* Added decorative floating line elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div className="absolute left-1/4 top-20 w-[1px] h-16 bg-neutral-300/30 dark:bg-neutral-700/30" animate={{ height: [16, 64, 16], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute right-1/4 top-40 w-[1px] h-24 bg-neutral-300/30 dark:bg-neutral-700/30" animate={{ height: [24, 96, 24], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
          <motion.div className="absolute left-1/3 bottom-20 w-16 h-[1px] bg-neutral-300/20 dark:bg-neutral-700/20" animate={{ width: [16, 64, 16], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
          <motion.div className="absolute right-1/3 bottom-40 w-12 h-[1px] bg-neutral-300/20 dark:bg-neutral-700/20" animate={{ width: [12, 48, 12], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="flex flex-col md:flex-row items-center justify-center text-5xl md:text-6xl font-thin tracking-wide text-neutral-900 dark:text-neutral-100 mb-8">
              <span className="relative pb-2 italic">
                <span className="font-extralight text-neutral-700 dark:text-neutral-300">Welcome to the</span>
                <span className="absolute bottom-0 left-1/4 right-1/4 h-px bg-neutral-200 dark:bg-neutral-800"></span>
                {/* Added animated decorative dot */}
                <motion.span
                  className="absolute bottom-0 left-1/4 w-1 h-1 bg-neutral-300/40 dark:bg-neutral-700/40 rounded-full"
                  animate={{
                    left: ["25%", "75%", "25%"],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>

              <div className="flex items-center my-3 md:my-0 mx-6 relative">
                {/* Added decorative rotating frame */}
                <motion.div className="absolute -inset-4 border border-neutral-200/20 dark:border-neutral-800/20 rounded-sm" animate={{ rotate: [0, 2, 0, -2, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
                <span className="absolute -inset-2 border-t border-b border-neutral-200 dark:border-neutral-800 opacity-60"></span>
                <img src={yorushikaLogo} alt="Yorushika" className="h-16 md:h-20 w-auto" />

                {/* Added corner accent lines */}
                <motion.div className="absolute -top-2 -left-2 w-3 h-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
                  <div className="absolute top-0 left-0 w-[1px] h-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
                </motion.div>
                <motion.div className="absolute -bottom-2 -right-2 w-3 h-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}>
                  <div className="absolute bottom-0 right-0 w-full h-[1px] bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
                  <div className="absolute bottom-0 right-0 w-[1px] h-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
                </motion.div>
              </div>

              <span className="relative italic">
                <span className="font-extralight tracking-wider text-neutral-700 dark:text-neutral-300">Fan Zone</span>
                <div className="absolute top-0 right-0 w-1 h-1 bg-neutral-200 dark:bg-neutral-600"></div>
                <div className="absolute bottom-0 left-0 w-1 h-1 bg-neutral-200 dark:bg-neutral-600"></div>

                {/* Added pulsing corner dot */}
                <motion.div className="absolute -top-2 -right-2 w-1 h-1 rounded-full bg-neutral-400/30 dark:bg-neutral-600/30" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
              </span>
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-12">
            Hello Yorushika fans! Welcome to the Yorushika Fan Zone—a place to learn more about our favorite band. Here you can explore everything from the stories behind their songs to the band's journey and the secrets of their unique sound.
          </motion.p>

          {/* Added decorative divider with animation */}
          <motion.div className="w-32 h-px mx-auto bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 128 }} transition={{ duration: 1, delay: 0.3 }} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col sm:flex-row justify-center gap-5 mt-8 relative">
            {/* Added subtle animated background element */}
            <motion.div
              className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral-200/5 via-transparent to-neutral-200/5 dark:from-neutral-800/5 dark:to-neutral-800/5 rounded-lg opacity-0"
              animate={{
                opacity: [0, 0.5, 0],
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={{ backgroundSize: "200% 100%" }}
            />

            <Link to="/albums" className="group relative px-7 py-3.5 overflow-hidden rounded-sm bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <span className="relative z-10 font-light tracking-wider text-sm uppercase">Explore Albums</span>
              <span className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>

              {/* Added corner accents */}
              <span className="absolute top-0 right-0 w-1 h-1 border-t border-r border-neutral-400/20 dark:border-neutral-600/20"></span>
              <span className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-neutral-400/20 dark:border-neutral-600/20"></span>
            </Link>

            <Link to="/about" className="group relative px-7 py-3.5 overflow-hidden rounded-sm bg-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
              <span className="relative z-10 font-light tracking-wider text-sm uppercase">Learn More</span>
              <span className="absolute bottom-0 left-0 w-full h-px bg-neutral-400 dark:bg-neutral-600 transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>

              {/* Added subtle pulse animation on hover */}
              <span className="absolute inset-0 bg-neutral-200/0 dark:bg-neutral-800/0 group-hover:bg-neutral-200/5 dark:group-hover:bg-neutral-800/5 transition-colors duration-300 rounded-sm"></span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Band Information Section */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Band Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="mt-24">
            <div className="max-w-2xl mx-auto pb-24 px-6 relative">
              {/* Corner accents - enhanced with delicate dotted patterns */}
              <div className="absolute -left-2 -top-2 w-6 h-6 border-l-2 border-t-2 border-neutral-200/40 dark:border-neutral-800/40 rounded-tl-sm"></div>
              <div className="absolute -right-2 -top-2 w-6 h-6 border-r-2 border-t-2 border-neutral-200/40 dark:border-neutral-800/40 rounded-tr-sm"></div>
              <div className="absolute -left-2 -bottom-2 w-6 h-6 border-l-2 border-b-2 border-neutral-200/40 dark:border-neutral-800/40 rounded-bl-sm"></div>
              <div className="absolute -right-2 -bottom-2 w-6 h-6 border-r-2 border-b-2 border-neutral-200/40 dark:border-neutral-800/40 rounded-br-sm"></div>

              {/* Corner dots - new minimalist embellishments */}
              <div className="absolute -left-3 -top-3 w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-60"></div>
              <div className="absolute -right-3 -top-3 w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-60"></div>
              <div className="absolute -left-3 -bottom-3 w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-60"></div>
              <div className="absolute -right-3 -bottom-3 w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-60"></div>

              {/* New outer corner micro-dots - extra subtle depth */}
              <div className="absolute -left-4 -top-4 w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
              <div className="absolute -right-4 -top-4 w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
              <div className="absolute -left-4 -bottom-4 w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
              <div className="absolute -right-4 -bottom-4 w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>

              {/* Decorative elements - minimalist lines and new accent patterns */}
              <div className="absolute left-0 top-12 w-4 h-px bg-neutral-300 dark:bg-neutral-700"></div>
              <div className="absolute right-0 top-12 w-4 h-px bg-neutral-300 dark:bg-neutral-700"></div>
              <div className="absolute left-4 bottom-24 w-px h-16 bg-neutral-200 dark:bg-neutral-800 opacity-70"></div>
              <div className="absolute right-4 bottom-24 w-px h-16 bg-neutral-200 dark:bg-neutral-800 opacity-70"></div>
              <div className="absolute left-0 top-0 w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-50"></div>
              <div className="absolute right-0 bottom-0 w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-50"></div>

              {/* New middle accent lines */}
              <div className="absolute left-8 top-0 h-px w-12 bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>
              <div className="absolute right-8 bottom-0 h-px w-12 bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>

              {/* New mid-side decorative elements */}
              <div className="absolute -left-1 top-1/3 flex flex-col space-y-1">
                <div className="w-0.5 h-3 bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>
                <div className="w-1.5 h-px bg-neutral-200 dark:bg-neutral-800 opacity-20"></div>
              </div>
              <div className="absolute -right-1 bottom-1/3 flex flex-col items-end space-y-1">
                <div className="w-0.5 h-3 bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>
                <div className="w-1.5 h-px bg-neutral-200 dark:bg-neutral-800 opacity-20"></div>
              </div>

              {/* Diagonal accent lines - refined with proper spacing */}
              <div className="absolute left-0 top-1/4 w-3 h-px bg-neutral-200 dark:bg-neutral-800 opacity-40 rotate-45"></div>
              <div className="absolute right-0 top-1/4 w-3 h-px bg-neutral-200 dark:bg-neutral-800 opacity-40 -rotate-45"></div>
              <div className="absolute left-0 bottom-1/4 w-3 h-px bg-neutral-200 dark:bg-neutral-800 opacity-40 -rotate-45"></div>
              <div className="absolute right-0 bottom-1/4 w-3 h-px bg-neutral-200 dark:bg-neutral-800 opacity-40 rotate-45"></div>

              {/* New diagonal pairs - subtle reinforcement */}
              <div className="absolute left-0 top-1/3 w-2 h-px bg-neutral-200 dark:bg-neutral-800 opacity-30 rotate-45"></div>
              <div className="absolute left-0 top-1/3 translate-y-1 w-1 h-px bg-neutral-200 dark:bg-neutral-800 opacity-20 rotate-45"></div>
              <div className="absolute right-0 bottom-1/3 w-2 h-px bg-neutral-200 dark:bg-neutral-800 opacity-30 -rotate-45"></div>
              <div className="absolute right-0 bottom-1/3 translate-y-1 w-1 h-px bg-neutral-200 dark:bg-neutral-800 opacity-20 -rotate-45"></div>

              {/* New subtle micropatterns */}
              <div className="absolute left-1/4 top-0 flex space-x-1">
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-20"></div>
              </div>
              <div className="absolute right-1/4 bottom-0 flex space-x-1">
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-20"></div>
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-40"></div>
              </div>

              {/* New micro-pattern groups on sides */}
              <div className="absolute left-1/2 -translate-x-20 top-0 flex space-x-0.5">
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-30"></div>
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-10"></div>
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-20"></div>
              </div>
              <div className="absolute right-1/2 translate-x-20 bottom-0 flex space-x-0.5">
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-20"></div>
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-10"></div>
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-30"></div>
              </div>

              <div className="mb-10 text-center relative">
                {/* Decorative circles with refined positioning */}
                <div className="absolute -left-1 -top-6 w-2 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 opacity-60"></div>
                <div className="absolute -right-1 -top-6 w-2 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 opacity-60"></div>

                {/* New decorative micro-elements */}
                <div className="absolute left-1/3 -top-3 w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-50"></div>
                <div className="absolute right-1/3 -top-3 w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 opacity-50"></div>

                {/* New decorative corners above title */}
                <div className="absolute left-1/4 -top-5 w-3 h-3">
                  <div className="absolute top-0 left-0 w-2 h-px bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>
                  <div className="absolute top-0 left-0 h-2 w-px bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>
                </div>
                <div className="absolute right-1/4 -top-5 w-3 h-3">
                  <div className="absolute top-0 right-0 w-2 h-px bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>
                  <div className="absolute top-0 right-0 h-2 w-px bg-neutral-200 dark:bg-neutral-800 opacity-30"></div>
                </div>

                {/* Thin horizontal lines flanking the title - with enhanced lengths */}
                <div className="absolute left-0 top-1/2 w-10 h-px bg-neutral-200 dark:bg-neutral-800 opacity-40"></div>
                <div className="absolute right-0 top-1/2 w-10 h-px bg-neutral-200 dark:bg-neutral-800 opacity-40"></div>

                <h2 className="text-2xl font-extralight tracking-wide text-neutral-900 dark:text-neutral-100">
                  About{" "}
                  <span className="font-normal relative">
                    <img src={yorushikaLogo} alt="Yorushika" className="h-6 md:h-8 inline-block" />
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-neutral-200 dark:bg-neutral-800 opacity-70"></span>
                  </span>
                </h2>

                {/* Enhanced title underline with subtle animation */}
                <div className="mt-1 h-px w-16 mx-auto bg-neutral-300 dark:bg-neutral-700 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-neutral-400 dark:bg-neutral-600 w-5 opacity-50"
                    style={{
                      animation: "moveLight 4s ease-in-out infinite",
                    }}
                  ></div>
                </div>
              </div>

              {/* Enhanced subtle gradient background with refined border frame */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-100/30 dark:via-neutral-900/30 to-transparent opacity-20 rounded-xl pointer-events-none"></div>
              <div className="absolute inset-0 border border-neutral-200/30 dark:border-neutral-800/30 rounded-xl pointer-events-none"></div>
              <div className="absolute inset-x-4 top-2 bottom-2 border-t border-b border-neutral-200/20 dark:border-neutral-800/20 rounded pointer-events-none"></div>

              {/* New inner border accent */}
              <div className="absolute inset-x-8 top-4 bottom-4 border-t border-b border-neutral-200/10 dark:border-neutral-800/10 rounded pointer-events-none"></div>

              {/* New subtle corner highlights */}
              <div className="absolute top-1 left-1 w-8 h-8 bg-gradient-to-br from-white/5 to-transparent rounded-tl-xl pointer-events-none"></div>
              <div className="absolute bottom-1 right-1 w-8 h-8 bg-gradient-to-tl from-white/5 to-transparent rounded-br-xl pointer-events-none"></div>

              {/* New opposite corner highlights - even more subtle */}
              <div className="absolute top-1 right-1 w-6 h-6 bg-gradient-to-bl from-white/3 to-transparent rounded-tr-xl pointer-events-none"></div>
              <div className="absolute bottom-1 left-1 w-6 h-6 bg-gradient-to-tr from-white/3 to-transparent rounded-bl-xl pointer-events-none"></div>

              <div className="space-y-5 text-neutral-700 dark:text-neutral-300 text-sm md:text-lg font-light relative">
                {/* Decorative quote marks - refined with better positioning */}
                <div className="absolute -left-4 top-0 text-3xl opacity-10 dark:opacity-5 font-serif text-neutral-400 dark:text-neutral-600">❝</div>
                <div className="absolute -right-4 bottom-12 text-3xl opacity-10 dark:opacity-5 font-serif text-neutral-400 dark:text-neutral-600">❞</div>

                {/* New mid-content decorative elements */}
                <div className="absolute left-2 top-1/2 -translate-y-4 w-1 h-1 rounded-full border border-neutral-300/20 dark:border-neutral-700/20"></div>
                <div className="absolute right-2 bottom-1/3 w-1 h-1 rounded-full border border-neutral-300/20 dark:border-neutral-700/20"></div>

                <p className="leading-relaxed">
                  <span className="font-normal text-neutral-800 dark:text-neutral-200">Yorushika (ヨルシカ)</span> is a Japanese rock duo founded in 2017 represented by Universal Music Japan. The group is composed of <span className="italic">n-buna</span>, a former vocaloid music producer, and <span className="italic">suis</span>, a female vocalist.
                </p>

                <p className="leading-relaxed">They are known for their juxtaposition of "passionate" and "upbeat" production and instrumentation fused with heavier lyrical content, which often explore ideas such as love and human emotion.</p>

                <p className="leading-relaxed">
                  The name "Yorushika" is taken from a lyric in their song "Kumo to Yūrei" (雲と幽霊): <span className="italic">"Yoru shika mō nemurezu ni"</span> (夜しかもう眠れずに), meaning "I can only sleep at night".
                </p>

                {/* Fixed structure: replaced p with div to avoid invalid nesting */}
                <div className="leading-relaxed flex items-center">
                  <span>The eye-designed logo mark</span>
                  <div className="inline-block mx-4 relative group">
                    <img src={yorushikaSVG} alt="Yorushika logo" className="h-16 w-16 invert group-hover:opacity-80 transition-opacity duration-300" />
                    <div className="absolute inset-0 border-t border-b border-transparent hover:border-neutral-200/30 dark:hover:border-neutral-800/30 transition-colors duration-300"></div>
                    {/* New logo highlight effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-radial-gradient from-white via-transparent to-transparent transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                  <span>
                    is a motif of two moons facing each other and also serves as a clock hand, portraying the time "from 6:00 to night"
                    <span className="h-px w-3 bg-neutral-300 dark:bg-neutral-700 opacity-50 inline-block ml-2"></span>
                  </span>
                </div>

                {/* New text content divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-200/20 dark:via-neutral-800/20 to-transparent my-6"></div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-12 items-center">
            {/* n-buna */}
            <div className="space-y-6">
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                <img
                  src="https://i.postimg.cc/SNhTNfwJ/image-31.png" // Replace with actual image path
                  alt="n-buna"
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-medium text-neutral-900 dark:text-neutral-100">n-buna</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2">Composer / Arranger</p>
              </div>
            </div>

            {/* suis */}
            <div className="space-y-6">
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                <img
                  src="https://i.postimg.cc/Sx9wtKFM/image-30.png" // Replace with actual image path
                  alt="suis"
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-medium text-neutral-900 dark:text-neutral-100">suis</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2">Vocalist</p>
              </div>
            </div>
          </motion.div>

          {/* Supporting Members */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="mt-16">
            <h3 className="text-2xl font-light text-center text-neutral-900 dark:text-neutral-100 mb-8">Supporting Members</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  name: "Shimozuru Mitsuyasu",
                  role: "Guitar",
                  image: "https://i.kfs.io/album/global/242317934,0v1/fit/500x500.jpg",
                },
                {
                  name: "Tatsuya Kitani",
                  role: "Bass",
                  image: "https://i.scdn.co/image/ab6761610000e5eb8f3b2ac021a12b2bd5f19edd",
                },
                {
                  name: "Masack",
                  role: "Drums",
                  image: "https://media.vgm.io/artists/61/39816/39816-1614202935.jpg",
                },
                {
                  name: "Tetsuya Hirahata",
                  role: "Piano",
                  image: "https://images.genius.com/9919e31807c90305e09f901afd71d3fd.630x630x1.jpg",
                },
              ].map((member, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">{member.name}</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
