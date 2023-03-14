import { motion } from "framer-motion";

export const withFramerMotion = (Component: any, i: number) => {
  return (props: any) => (
    <motion.div
      layout
      viewport={{ margin: "600px" }}
      initial={{ opacity: 0, y: -20 }}
      whileInView={{
        opacity: 1,
        transition: {
          type: "spring",
          delay: i * 0.15,
        },
        y: 0,
      }}
    >
      <Component {...props} />
    </motion.div>
  );
};
