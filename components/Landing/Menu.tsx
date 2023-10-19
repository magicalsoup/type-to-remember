import Link from "next/link";
import { Variants, motion } from "framer-motion";
import { useState } from "react";

export default function Menu() {
    const [isOpen, toggleIsOpen] = useState<boolean>(false);
    const itemVariants: Variants = {
        open: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 24 }
        },
        closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
    };

    return (       
        <motion.nav className="flex flex-row items-center bg-lime-800 h-screen text-white p-8 relative"
            initial={false}
            animate={isOpen ? "open" : "closed"}
            variants={{
                open: {
                    width: 275,
                },
                closed: {
                    width: 50
                }
            }}
            >
            <motion.ul 
                className="flex flex-col h-full pl-4 gap-y-16"
                variants={{
                    open: {
                        clipPath: "inset(0% 0% 0% 0% round 10px)",
                        transition: {
                            type: "spring",
                            bounce: 0,
                            duration: 0.7,
                            delayChildren: 0.3,
                            staggerChildren: 0.05
                        }
                    },
                    closed: {
                        clipPath: "inset(10% 50% 90% 50% round 10px)",
                        transition: {
                            type: "spring",
                            bounce: 0,
                            duration: 0.3
                        }
                    }
                }}>
                <motion.li variants={itemVariants}>
                    <div className="font-raleway text-4xl">menu</div>
                </motion.li>
                <motion.li variants={itemVariants}>
                    <Link href="/studylist">
                        <h1 className="font-raleway text-lg">study list</h1>
                    </Link>
                </motion.li>
                <motion.li variants={itemVariants}>
                    <Link href="/type">
                        <h1 className="font-raleway text-lg">practice</h1>
                    </Link>
                </motion.li>
            </motion.ul>

            <motion.button 
                whileTap={{ scale: 0.8 }}
                variants={{
                    open: {rotate: 180},
                    closed: {rotate: 0}
                }}
                transition={{duration: 0.2}}
                onClick={() => toggleIsOpen((prev) => !prev)}
                className="absolute right-4 w-6 h-6">
                    <svg width="35" height="24" viewBox="0 0 35 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M34.0607 13.0607C34.6464 12.4749 34.6464 11.5251 34.0607 10.9393L24.5147 1.3934C23.9289 0.807612 22.9792 0.807612 22.3934 1.3934C21.8076 1.97918 21.8076 2.92893 22.3934 3.51472L30.8787 12L22.3934 20.4853C21.8076 21.0711 21.8076 22.0208 22.3934 22.6066C22.9792 23.1924 23.9289 23.1924 24.5147 22.6066L34.0607 13.0607ZM0 13.5H33V10.5H0V13.5Z" fill="white"/>
                    </svg>
            </motion.button>

        </motion.nav>
    )
}