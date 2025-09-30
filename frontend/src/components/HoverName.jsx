const HoverName = ({ style = '', children }) => {
  return <div className={`absolute ${style}`}>{children}</div>;
};

export default HoverName;
