import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MusicalNoteIcon } from "@heroicons/react/24/outline";
import yorushikaLogo from "../assets/yorushika.png";
import yorushikaGIF from "../assets/YORUSHIKAA.gif";

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
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="flex flex-col md:flex-row items-center justify-center text-5xl md:text-6xl font-thin tracking-wide text-neutral-900 dark:text-neutral-100 mb-8">
              <span className="relative pb-2 italic">
                <span className="font-extralight text-neutral-700 dark:text-neutral-300">Welcome to the</span>
                <span className="absolute bottom-0 left-1/4 right-1/4 h-px bg-neutral-200 dark:bg-neutral-800"></span>
              </span>

              <div className="flex items-center my-3 md:my-0 mx-6 relative">
                <span className="absolute -inset-2 border-t border-b border-neutral-200 dark:border-neutral-800 opacity-60"></span>
                <img src={yorushikaLogo} alt="Yorushika" className="h-16 md:h-20 w-auto" />
              </div>

              <span className="relative italic">
                <span className="font-extralight tracking-wider text-neutral-700 dark:text-neutral-300">Fan Zone</span>
                <div className="absolute top-0 right-0 w-1 h-1 bg-neutral-200 dark:bg-neutral-600"></div>
                <div className="absolute bottom-0 left-0 w-1 h-1 bg-neutral-200 dark:bg-neutral-600"></div>
              </span>
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-12">
            Hello Yorushika fans! Welcome to the Yorushika Fan Zone—a place to learn more about our favorite band. Here you can explore everything from the stories behind their songs to the band's journey and the secrets of their unique sound.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col sm:flex-row justify-center gap-5 mt-8">
            <Link to="/albums" className="group relative px-7 py-3.5 overflow-hidden rounded-sm bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <span className="relative z-10 font-light tracking-wider text-sm uppercase">Explore Albums</span>
              <span className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </Link>

            <Link to="/about" className="group relative px-7 py-3.5 overflow-hidden rounded-sm bg-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
              <span className="relative z-10 font-light tracking-wider text-sm uppercase">Learn More</span>
              <span className="absolute bottom-0 left-0 w-full h-px bg-neutral-400 dark:bg-neutral-600 transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Band Information Section */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Band Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="mt-24">
            <div className="max-w-2xl mx-auto pb-24 px-6">
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-extralight tracking-wide text-neutral-900 dark:text-neutral-100">
                  About{" "}
                  <span className="font-normal">
                    <img src={yorushikaLogo} alt="Yorushika" className="h-6 md:h-8 inline-block" />
                  </span>
                </h2>
                <div className="mt-1 h-px w-8 mx-auto bg-neutral-300 dark:bg-neutral-700"></div>
              </div>

              <div className="space-y-5 text-neutral-700 dark:text-neutral-300 text-sm md:text-base font-light">
                <p className="leading-relaxed">
                  <span className="font-normal text-neutral-800 dark:text-neutral-200">Yorushika (ヨルシカ)</span> is a Japanese rock duo founded in 2017 represented by Universal Music Japan. The group is composed of <span className="italic">n-buna</span>, a former vocaloid music producer, and <span className="italic">suis</span>, a female vocalist.
                </p>

                <p className="leading-relaxed">They are known for their juxtaposition of "passionate" and "upbeat" production and instrumentation fused with heavier lyrical content, which often explore ideas such as love and human emotion.</p>

                <p className="leading-relaxed">
                  The name "Yorushika" is taken from a lyric in their song "Kumo to Yūrei" (雲と幽霊): <span className="italic">"Yoru shika mō nemurezu ni"</span> (夜しかもう眠れずに), meaning "I can only sleep at night".
                </p>
                <p>The eye-designed logo mark is a motif of two moons facing each other and also serves as a clock hand, portraying the time "from 6:00 to night"</p>
              </div>

              <div className="mt-10 text-center">
                <div className="h-px w-6 mx-auto bg-neutral-200 dark:bg-neutral-800"></div>
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
