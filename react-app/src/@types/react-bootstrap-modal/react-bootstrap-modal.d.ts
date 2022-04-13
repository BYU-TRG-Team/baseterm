/// <reference types="node" />

declare module "react-bootstrap-modal" {

  interface ReactBootstrapModal<P> extends React.FunctionComponent<P> {
    [key: string]: React.ReactComponentElement,
  }

  const ReactBootstrapModal: ReactBootstrapModal<{
    show: boolean,
    onHide: () => void,
    children: React.ReactNode,
    backdrop?: "static"
  }> = (props) => JSX.Element;

  export default ReactBootstrapModal;
}