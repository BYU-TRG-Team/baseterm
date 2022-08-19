interface Props {
  ariaHidden?: boolean;
}

const RefreshIcon = ({
  ariaHidden = false
}: Props) => { 
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24"
      aria-hidden={ariaHidden}
    >
      <path d="M15,10h6V4H19V6.339a9,9,0,1,0,1.716,7.91l-1.936-.5A7.028,7.028,0,1,1,17.726,8H15Z"/>
    </svg>
  );
};

export default RefreshIcon;