import dynamic from "next/dynamic";

const Device = dynamic(() => import("./DeviceView"), { ssr: false });

export default Device;
