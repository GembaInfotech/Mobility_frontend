import React from 'react';
import { Button } from 'components/ui';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';
// import { AiOutlineFile } from 'react-icons/ai';
import ReactToPrint from 'react-to-print';
import { ExportPdf } from "assets/svg";

const HeaderPanel = ({ pageHeader, componentRef, orderDetails }) => {
  const navigate = useNavigate();
  const onBackClick = () => {
    navigate('/app/orderManagement/service-order');
  };
 
  const pageStyle = `
 
  @media all {
    .pagebreak {
      display: none;
    }
  }

  @media print {
    .page-break {
      display: none;
    }
    html, body {
      overflow: initial !important;
      height: initial !important;
    }
    .input {
      padding : 0px !important;
      margin : 0px !important;
      border-width:0px;
      border:none;
    }
  }
`;

  return (
    <div className="flex items-center justify-between my-5">
      <div> </div>

      <div className="flex">
        <ReactToPrint
          documentTitle={orderDetails?.orderNo}
          pageStyle={pageStyle}
          onBeforeGetContent={() => pageHeader}
          trigger={() => (
            <Button
              size="sm"
              variant="solid"
              className="flex items-center	mr-5 gap-2"
            >
              <ExportPdf />
              Export PDF
            </Button>
          )}
          content={() => componentRef.current}
        />
        <Button onClick={onBackClick} size="sm" variant="solid" className="flex items-center	">
          <MdKeyboardBackspace style={{ fontSize: '20px', marginRight: '4px' }} />
          Back
        </Button>
      </div>
    </div>
  );
};

export default HeaderPanel;
