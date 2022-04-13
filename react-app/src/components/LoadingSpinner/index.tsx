import { SpinnerCircular } from 'spinners-react';

interface Props {
  show: boolean;
}

const LoadingSpinner: React.FC<Props> = ({ show }: Props) => {
  return (
    show ?
    <div style={{
      position: 'fixed',
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <SpinnerCircular 
        style={{
          position: "absolute",
          width: "100px" 
        }}
        color="blue"
      />
    </div> :
    null
  );
};

export default LoadingSpinner;