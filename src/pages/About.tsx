import { Header } from "@/components/Header";
import Grouplogo from "@/assets/Group_logo.png";
import TextPressure from "@/components/TextPressure";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import TiltedCard from "@/components/TiltedCard";
import LogoLoop from "@/components/LogoLoop";
import { Footer } from "@/components/Footer";


export default function About() {

    const members = [
        "Cornelouis",
        "Alafta Fahri Yusuf",
        "Husna Syahnural Wirawan",
        "Tay Zar Minn Htet",
        "Htin Shar Htet Naing",
        "Josafhat Fidelcastro Mambor",
        "Ryan Richardo (Ex Member)"
    ];

    const [isDark, setIsDark] = useState(
        document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const techLogos = [
        { src: "/logos/react.svg.svg", alt: "React" },
        { src: "/logos/typescript.svg.svg", alt: "TypeScript" },
        { src: "/logos/javascript.svg.svg", alt: "JavaScript" },
        { src: "/logos/vite.svg.svg", alt: "Vite" },
        { src: "/logos/html5.svg.svg", alt: "HTML5" },
        { src: "/logos/css3.svg.svg", alt: "CSS3" }
    ];


    return (
        <>
            <Header />

            <main className="mx-auto max-w-7xl px-4 py-12">

                <div className="text-center mb-19">
                    <p className="text-gray-600 dark:text-gray-400 tracking-widest uppercase text-sm">
                        Developed by
                    </p>

                    <p className="text-gray-800 dark:text-gray-300 text-lg mt-2">
                        Synapse Development Team
                    </p>
                </div>

                {/* SYNAPSE TITLE */}
                <div className="text-center my-15">
                    <TextPressure
                        text="SYNAPSE"
                        flex
                        alpha={false}
                        stroke={false}
                        width
                        weight
                        italic
                        textColor={isDark ? "#60A5FA" : "#0e1c47"}
                        strokeColor="#5227FF"
                        minFontSize={60}
                    />
                </div>

                {/* TECH STACK LOOP */}
                <div className="mt-16">
                    <LogoLoop
                        logos={techLogos}
                        speed={40}
                        direction="left"
                        logoHeight={60}
                        gap={80}
                    />
                </div>


                {/* MEMBERS + LOGO SECTION */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-24 mt-40 max-w-5xl mx-auto">

                    {/* MEMBERS LEFT */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.15 } }
                        }}
                    >
                        {members.map((member, index) => (
                            <motion.div
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-r from-[#0f172a] to-[#020617]
                                p-6 rounded-xl border border-blue-500/10
                                text-center transition-all duration-300
                                hover:border-blue-400/40
                                hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]"
                            >
                                <p className="font-semibold text-gray-200">{member}</p>
                            </motion.div>
                        ))}
                    </motion.div>


                    {/* LOGO RIGHT */}
                    <div className="flex justify-center">

                        <TiltedCard
                            imageSrc={Grouplogo}
                            altText="Synapse Logo"
                            captionText="Synapse's Logo"
                            containerHeight="320px"
                            containerWidth="320px"
                            imageHeight="320px"
                            imageWidth="320px"
                            rotateAmplitude={12}
                            scaleOnHover={1.08}
                            showMobileWarning={false}
                            showTooltip
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}