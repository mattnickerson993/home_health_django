import React from "react";
import { getAvailablePatients } from "../../services/AptService";

const AvailablePatients = () => {
  React.useEffect(() => {
    const loadAvailablePatients = async () => {
      const res = await getAvailablePatients();
      console.log("res", res);
    };
    loadAvailablePatients();
  }, []);

  return <div>AvailablePatients</div>;
};

export default AvailablePatients;
