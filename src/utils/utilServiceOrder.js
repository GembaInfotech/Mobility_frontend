import dayjs from 'dayjs';
import {
  CARD_KEY,
  PROVIDER_STATUS,
  SERVICE_ORDER_STATUS,
} from 'views/orderManagement/serviceOrder/serviceConstant';
import { AiOutlineFileImage, AiOutlineFilePdf } from 'react-icons/ai';
import appConfig from 'configs/app.config';
import { STATUS_OPTIONS } from 'constants/app.constant';

const getOptionForCode = (codeString) => {
  const codeArray = codeString.split(',');
  const OptionArray = codeArray.map((code, i) => {
    return { label: code, value: code };
  });
  return OptionArray;
};

export const getDateDiffer = (row) => {
  const currentDate = new Date();
  var date1 = new Date(row?.createdAt);
  var date2 = new Date(currentDate);
  const DifferenceInTime = date2.getTime() - date1.getTime();
  return Math.trunc(DifferenceInTime / (1000 * 3600 * 24));
};

const GENDER_CONSTANT = [
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
  { label: 'Others', value: 3 },
];

export const infoHandler = (value, key, allStaff, allData, codeKey) => {
  if (key) {
    if (key === 'patientName') {
      return `${allData?.patient?.firstName ? allData?.patient?.firstName : ''} ${
        allData?.patient?.lastName ? allData?.patient?.lastName : ''
      }`;
    }
    if (key === 'gender') {
      const obj = GENDER_CONSTANT?.find((obj, i) => obj?.value === value);
      return obj?.label;
    }
    if (key === 'pdf') {
      const open = appConfig.imageBaseUrl + value;

      return (
        <>
          {value === null ? (
            '-'
          ) : (
            <a href={open} target="_blank" className="flex flex-wrap">
              <AiOutlineFilePdf className="text-2xl cursor-pointer" />
            </a>
          )}
        </>
      );
    }
    if (key === 'date') {
      if (value !== null) {
        return dayjs(value).format('DD MMM YYYY');
      } else {
        return '-';
      }
    }
    if (key === 'orderStatus') {
      return (
        <div className="font-bold text-black">
          {SERVICE_ORDER_STATUS?.find((item) => item.value === value)?.label}
        </div>
      );
    }
    if (key === 'providerStatus') {
      return (
        <div className="font-bold text-black">
          {PROVIDER_STATUS?.find((item) => item.value === value)?.label}
        </div>
      );
    }
    if (key === 'providerId') {
      return (
        <div className="">{`${allData?.providerAssigned?.firstName} ${allData?.providerAssigned?.lastName}`}</div>
      );
    }
    if (key === 'images') {
      const open = (url) => {
        return appConfig.imageBaseUrl + url;
      };
      return (
        <div className="flex flex-col">
          {value === null
            ? '-'
            : value?.map((url, index) => (
                <a
                  href={open(url?.original)}
                  target="_blank"
                  className="flex flex-wrap items-end border-b-2 my-2 border-white hover:border-blue-700 hover:text-blue-700"
                  key={index}
                >
                  {url?.type === 'IMAGE' ? (
                    <AiOutlineFileImage className="text-2xl cursor-pointer" />
                  ) : (
                    <AiOutlineFilePdf className="text-2xl cursor-pointer" />
                  )}
                  {url?.original}
                </a>
              ))}
        </div>
      );
    }
    if (key === 'apiObject') {
      if (value) {
        const userObj = allStaff.find((item, i) => item.id === value);
        return `${userObj ? `${userObj?.firstName} ${userObj?.lastName}` : ''}`;
      }
      return '';
    }

    if (key === 'mobileWithCode') {
      return `${
        codeKey !== null && codeKey !== undefined && value !== null && value !== undefined
          ? `${codeKey}-${value}`
          : ''
      }`;
    }
    if (key === 'time') {
      if (value !== null && value !== '' && value !== undefined) {
        return dayjs(value).format('hh:mm  A');
      } else {
        return '-';
      }
    }
    if (key === 'bold') {
      return <div className="font-bold text-black">{value}</div>;
    }
    if (key === 'boolean') {
      return value === 0 ? 'false' : 'true';
    }
    if (key === 'insuranceStatus') {
      return STATUS_OPTIONS?.find((item) => item?.value === value)?.label;
    }
  } else {
    return value;
  }
};

export const getFormValues = (key, patientData, clinicianId, technicianId) => {
  switch (key) {
    case CARD_KEY.PERSONAL_INFORMATION:
      return {
        firstName: patientData?.patient?.firstName,
        lastName: patientData?.patient?.lastName,
        gender: patientData?.patient?.gender,
        dob: patientData?.patient?.dob,
        address: patientData?.patient?.address,
        alternateCountryCode:
          patientData?.patient?.alternateCountryCode !== null
            ? patientData?.patient?.alternateCountryCode
            : '+1',
        countryCode:
          patientData?.patient?.countryCode !== null ? patientData?.patient?.countryCode : '+1',
        phoneNumber:
          patientData?.patient?.countryCode !== null && patientData?.patient?.phoneNumber !== null
            ? `${patientData?.patient?.countryCode}${patientData?.patient?.phoneNumber}`
            : '',
        alternatePhoneNumber:
          patientData?.patient?.alternateCountryCode !== null &&
          patientData?.patient?.alternatePhoneNumber !== null
            ? `${patientData?.patient?.alternateCountryCode}${patientData?.patient?.alternatePhoneNumber}`
            : '',

        email: patientData?.patient?.email,
      };
    case CARD_KEY.SERVICE_ORDER_DETAILS:
      return {
        orderStatus: patientData?.orderStatus,
        name: patientData?.name,
        address: patientData?.address,
        city: patientData?.city,
        state: patientData?.state,
        countryCode: patientData?.countryCode !== null ? patientData?.countryCode : '+1',
        phoneNumber:
          patientData?.countryCode !== null && patientData?.phoneNumber !== null
            ? `${patientData?.countryCode}${patientData?.phoneNumber}`
            : '',
        faxNumber: patientData?.faxNumber,
        currentMedications: patientData?.currentMedications,
        surgicalHx: patientData?.surgicalHx,
        allergies: patientData?.allergies,
        previousImaging: patientData?.previousImaging,
        dateOfInjury: patientData?.dateOfInjury !== null ? patientData?.dateOfInjury : new Date(),
        descriptionInjury: patientData?.descriptionInjury,
        managerName: patientData?.managerName,
        managerPhone:
          patientData?.managerCountryCode !== null && patientData?.managerPhone !== null
            ? `${patientData?.managerCountryCode}${patientData?.managerPhone}`
            : '',
        managerCountryCode:
          patientData?.managerCountryCode !== null ? patientData?.managerCountryCode : '+1',
        managerFax: patientData?.managerFax,
        managerEmail: patientData?.managerEmail,
        managerDescriptionInjury: patientData?.managerDescriptionInjury,
        managerSignFile: patientData?.managerSignFile,
        facilityName: patientData?.facilityName,
        facilityAppointmentDate: patientData?.facilityAppointmentDate,
        facilityAppointmentTime: patientData?.facilityAppointmentTime,
        facilityPhone:
          patientData?.facilityCountryCode !== null && patientData?.facilityCountryCode !== null
            ? `${patientData?.facilityCountryCode}${patientData?.facilityPhone}`
            : '',
        facilityCountryCode:
          patientData?.facilityCountryCode !== null ? patientData?.facilityCountryCode : '+1',
        facilityAddress: patientData?.facilityAddress,

        refferalInfo: patientData?.refferalInfo === null ? [] : patientData?.refferalInfo,
      };

    case CARD_KEY.UPLOAD_DOCUMENTS:
      return {
        insuranceCard: patientData?.insuranceCard,
        physicianNotes: patientData?.physicianNotes,
        prescription: patientData?.prescription,
      };
    case CARD_KEY.SERVICE_ORDER_ASSIGNED_TO_CLINICIAN:
      return { clinicianId: clinicianId };
    case CARD_KEY.SERVICE_ORDER_ASSIGNED_TO_TECHNICIAN:
      return { technicianId: technicianId };
    case CARD_KEY.APPOINTMENT:
      return {
        appointmentDate:
          patientData?.appointmentDate !== null
            ? new Date(patientData?.appointmentDate)
            : new Date(),
        appointmentTime:
          patientData?.appointmentTime !== null ? new Date(patientData?.appointmentTime) : '',
        appointmentAddress:
          patientData?.appointmentAddress !== null ? patientData?.appointmentAddress : '',
      };
    case CARD_KEY.HMO_WC:
      return {
        providerId: {
          label: `${patientData?.providerAssigned?.firstName} ${patientData?.providerAssigned?.lastName}`,
          value: patientData?.providerAssigned?.id,
        },
        providerStatus: patientData?.providerStatus,
        providerRemarks: patientData?.providerRemarks,
        documentsByProvider: patientData?.documentsByProvider,
      };
    case CARD_KEY.MORE_INFORMATION:
      return {
        castingTaken: patientData?.castingTaken === 1 ? true : false,
        diagnosisAttachment: patientData?.diagnosisAttachment,
        diagnosisNotes: patientData?.diagnosisNotes,
        icdCodes: patientData?.icdCodes !== null ? getOptionForCode(patientData?.icdCodes) : [],
        lcodes: patientData?.lcodes !== null ? getOptionForCode(patientData?.lcodes) : [],
        length: patientData?.length,
        measurement: patientData?.measurement,
        width: patientData?.width,
      };
    case CARD_KEY.INSURANCE_INFORMATION:
      return {
        insuranceStatus: patientData.insuranceStatus,
        insuranceAmount: patientData.insuranceAmount,
        insuranceNotes: patientData.insuranceNotes,
      };
    default:
      return null;
  }
};
