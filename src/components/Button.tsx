import { motion } from "framer-motion";
import React from "react";

const Button = ({ children, ...props }: any) => {
  return (
    <motion.button
      className="btn-primary"
      {...props}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
