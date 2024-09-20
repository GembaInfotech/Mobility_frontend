"use strict";(self.webpackChunknasp=self.webpackChunknasp||[]).push([[1145],{40209:function(e,a,l){l.d(a,{oK:function(){return n}});l(72791);var r=l(80184),n=function(){return(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",id:"Layer_1","data-name":"Layer 1",viewBox:"0 0 24 24",width:"20",height:"20",fill:"#F37404",children:(0,r.jsx)("path",{d:"M6.97,13h-1.97v6h1v-2h.97c1.11,0,2.01-.92,2.01-2.02s-.9-1.98-2.01-1.98Zm0,3h-.97v-2h.97c.56,0,1.01,.44,1.01,.98s-.46,1.02-1.01,1.02Zm5.03-3h0c-.06,0-2,0-2,0v6s1.94,0,2,0h0c1.11,0,2-.89,2-1.98v-2.03c0-1.09-.89-1.98-2-1.98Zm1,4.02c0,.53-.43,.96-.96,.98h-1.04v-4h1.04c.53,.02,.96,.46,.96,.98v2.03Zm2-4.02h4v1h-3v2s2,0,2,0v1h-2v2h-1v-6Zm-.29-13H4.5c-1.38,0-2.5,1.12-2.5,2.5V24H22V7.29L14.71,0Zm.29,1.71l5.29,5.29h-5.29V1.71ZM3,23V2.5c0-.83,.67-1.5,1.5-1.5H14v7h7v15H3Z"})})}},9494:function(e,a,l){l.d(a,{EY:function(){return t},Fv:function(){return d},ac:function(){return o}});var r=l(74165),n=l(15861),i=l(91181),c=l(14712);function o(e,a){return c.Z.get(e,{params:a}).then((function(e){return null===e||void 0===e?void 0:e.data}))}function d(e,a){return c.Z.post(e,a).then((function(e){return null===e||void 0===e?void 0:e.data}))}function t(e){return s.apply(this,arguments)}function s(){return(s=(0,n.Z)((0,r.Z)().mark((function e(a){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",i.Z.fetchData({url:"/search/query",method:"post",data:a}));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}},95396:function(e,a,l){l(72791),l(16146),l(61146),l(40209),l(80184)},21145:function(e,a,l){l.r(a);var r=l(29439),n=l(72791),i=l(92506),c=l(16146),o=l(40209),d=l(97892),t=l.n(d),s=l(52639),u=l(11723),m=l(9494),v=l(57689),b=(l(95396),l(16856)),p=l(72426),h=l.n(p),x=l(54048),f=l(80184),N={patientName:"",patientId:"",patientDob:"",primaryDeviceType:"",lCode:[{code:"",quantity:1,description:""}],icd:[{code:"",description:""}],quantity:"",description:"",monthlyFrequency:"Daily",lengthOfNeed:"Life Time",startDate:"",insuranceInfo:"",prescriberName:"",prescriberNpi:"",prescriberAddress:"",prescriberWorkPhone:"",notes:""},j=[{label:"Patient Name ",name:"patientName",placeholder:"Patient Name "},{label:"Patient ID",name:"patientId",placeholder:"Patient ID"},{label:"Patient DOB",name:"patientDob",placeholder:"Patient DOB"},{label:"Device Type",name:"primaryDeviceType",placeholder:"Primary Device Type"}],y=[{label:"Projected Monthly Frequency",name:"monthlyFrequency",placeholder:"Projected Monthly Frequency",value:"Daily"},{label:"Estimated Length of Need",name:"lengthOfNeed",placeholder:"Estimated Length of Need",value:"Life Time"},{label:"Start Date",name:"startDate",placeholder:"Start Date"},{label:"Insurance/Medicare Info",name:"insuranceInfo",placeholder:"Insurance/Medicare Info"},{label:"Prescriber Name",name:"prescriberName",placeholder:"Prescriber Name"},{label:"Prescriber NPI",name:"prescriberNpi",placeholder:"Prescriber NPI"},{label:"Doctor Name",name:"doctorName",placeholder:"Doctor Name"},{label:"Doctor NPI",name:"doctorNpi",placeholder:"Doctor NPI"},{label:"Prescriber Address",name:"prescriberAddress",placeholder:"Prescriber Address"},{label:"Prescriber Work Phone",name:"prescriberWorkPhone",placeholder:"Prescriber Work Phone"}];a.default=function(){var e,a,l=(0,v.UO)().id,d=(0,n.useState)(),p=(0,r.Z)(d,2),k=p[0],g=p[1],I=(0,n.useRef)(),P=(0,v.s0)();(0,n.useEffect)((function(){l&&(0,m.ac)(u.vh.GET_SERVICE_ORDER,{id:l}).then((function(e){var a,l,r,n,i,c,o,d,u,m,v=null===e||void 0===e||null===(a=e.data)||void 0===a?void 0:a.data,b=v.patientId,p=v.physicianId,h=v.prescriptions,x=v.renderingPhysicianId,f={};f.orderNo="".concat((null===e||void 0===e||null===(l=e.data)||void 0===l||null===(r=l.data)||void 0===r?void 0:r.orderNo)||""),f.patientName="".concat(null===b||void 0===b?void 0:b.lastName," ").concat(null===b||void 0===b?void 0:b.firstName),f.patientId="".concat((null===b||void 0===b?void 0:b.patientNo)||""),f.patientDob="".concat(t()(null===b||void 0===b?void 0:b.dob).format(s.zT)||""),f.startDate="".concat(t()(null===e||void 0===e||null===(n=e.data)||void 0===n||null===(i=n.data)||void 0===i?void 0:i.createdAt).format(s.zT)||""),f.primaryDeviceType="".concat((null===h||void 0===h||null===(c=h[0])||void 0===c||null===(o=c.deviceType)||void 0===o?void 0:o.name)||""),f.insuranceInfo="".concat((null===b||void 0===b||null===(d=b.primaryInsurance)||void 0===d?void 0:d.name)||""),f.prescriberName="".concat((null===p||void 0===p?void 0:p.name)||""),f.prescriberNpi="".concat((null===p||void 0===p?void 0:p.npiNo)||""),f.prescriberAddress="".concat((null===p||void 0===p?void 0:p.address)||""),f.prescriberWorkPhone="".concat((null===p||void 0===p?void 0:p.countryCode)||"","-").concat((null===p||void 0===p?void 0:p.phoneNumber)||""),f.notes="".concat((null===e||void 0===e||null===(u=e.data)||void 0===u||null===(m=u.data)||void 0===m?void 0:m.notes)||""),f.lCode=null===h||void 0===h?void 0:h.map((function(e,a){var l,r;return{code:null===(l=e.lCode)||void 0===l?void 0:l.code,description:(null===(r=e.lCode)||void 0===r?void 0:r.description)||"",quantity:e.quantity||"1"}})),f.doctorName="".concat((null===x||void 0===x?void 0:x.name)||"-"),f.doctorNpi="".concat((null===x||void 0===x?void 0:x.npiNo)||"-"),f.icd=null===h||void 0===h?void 0:h.flatMap((function(e){var a;return null===(a=e.icdCode)||void 0===a?void 0:a.map((function(e){return{code:null===e||void 0===e?void 0:e.code,description:(null===e||void 0===e?void 0:e.description)||""}}))})),f.monthlyFrequency="Daily",f.lengthOfNeed="Life Time",g(f)}))}),[l]);var D=(0,i.TA)({initialValues:l?k:N,enableReinitialize:!0,onSubmit:function(e){(0,m.Fv)(u.vh.GENERATE_PDF,{data:e,type:1}).then((function(e){var a;c.Am.push((0,f.jsx)(c.P_,{type:"success",children:"Success"})),window.open("".concat(x.Z.imageBaseUrl).concat(null===e||void 0===e||null===(a=e.data)||void 0===a?void 0:a.path),"_blank")})).catch((function(e){c.Am.push((0,f.jsx)(c.P_,{type:"error",children:e}))})).finally((function(){q(!1)}))}}),w=D.values,C=D.handleSubmit,T=D.setFieldValue,Z=D.isSubmitting,q=D.setSubmitting;return(0,f.jsx)(i.Hy,{value:D,children:(0,f.jsxs)(i.l0,{className:"p-1",onSubmit:C,autoComplete:"off",noValidate:!0,children:[(0,f.jsxs)("div",{className:"flex mb-3 justify-between",children:[(0,f.jsx)("h3",{className:"mb-10"}),(0,f.jsxs)("div",{className:"flex",children:[(0,f.jsxs)(c.zx,{size:"sm",variant:"solid",className:"flex items-center\tmr-5 gap-2",loading:Z,type:"submit",children:[(0,f.jsx)(o.oK,{}),"Export PDF"]}),(0,f.jsxs)(c.zx,{size:"sm",variant:"solid",onClick:function(){return P("/app/orderManagement/service-order")},type:"button",className:"flex items-center",children:[(0,f.jsx)(b.dWm,{style:{fontSize:"20px"}}),"Back / Cancel"]})]})]}),(0,f.jsx)("div",{className:"border border-black",children:(0,f.jsxs)("div",{className:"p-8",ref:I,children:[(0,f.jsx)("div",{className:"text-[20px] text-center mb-4 border-b border-black",children:(0,f.jsx)("h1",{children:"North American Spine & Pain Clinic"})}),(0,f.jsx)("div",{className:"page-header"}),(0,f.jsx)("h2",{className:"text-center text-xl font-bold mb-4",children:"RX / Detailed Written Order and Letter of Medical Necessity"}),(0,f.jsxs)("div",{className:"max-w-4xl mx-auto my-2 border border-black",children:[(0,f.jsxs)("div",{className:"py-4 mb-2",children:[(0,f.jsx)("h3",{className:"font-bold mb-2 text-center",children:"Patient Information"}),(0,f.jsx)("div",{className:"overflow-visible",children:(0,f.jsx)("div",{className:"grid grid-cols-4 border-y border-black",children:j.map((function(e,a){return(0,f.jsxs)("div",{className:"flex flex-col ".concat(a!==(null===j||void 0===j?void 0:j.length)-1?"border-r border-black":""," "),children:[(0,f.jsx)("label",{className:"p-2 text-black font-medium border-b border-black",children:e.label}),(0,f.jsx)("div",{className:"p-2",children:(0,f.jsx)(i.gN,{name:e.name,placeholder:e.placeholder,className:"w-full",component:c.II})})]},a)}))})})]}),(0,f.jsxs)("div",{className:"py-1 mb-2",children:[(0,f.jsx)("h3",{className:"font-bold mb-2 text-center",children:"Product / Procedure"}),(0,f.jsx)("div",{className:"overflow-visible border-y border-black",children:null===w||void 0===w||null===(e=w.lCode)||void 0===e?void 0:e.map((function(e,a){return(0,f.jsxs)("div",{className:"flex",children:[(0,f.jsxs)("div",{className:"flex flex-col border-r border-black",children:[(0,f.jsx)("label",{className:"p-2 text-black font-medium border-b border-black",children:"L-Code"}),(0,f.jsx)("div",{className:"p-2",children:(0,f.jsx)(c.II,{name:"code",placeholder:"L-Code",className:"w-[100px]",value:null===e||void 0===e?void 0:e.code,onChange:function(e){var l=e.target.value,r=w;r.lCode[a].code=l,T("lCode",r.lCode)}})})]}),(0,f.jsxs)("div",{className:"flex flex-col border-r border-black",children:[(0,f.jsx)("label",{className:"p-2 text-black font-medium border-b border-black",children:"Quantity"}),(0,f.jsx)("div",{className:"p-2",children:(0,f.jsx)(c.II,{name:"quantity",placeholder:"Quantity",className:"w-[100px]",value:null===e||void 0===e?void 0:e.quantity,onChange:function(e){var l=e.target.value,r=w;r.lCode[a].quantity=l,T("lCode",r.lCode)}})})]}),(0,f.jsxs)("div",{className:"flex flex-col flex-1",children:[(0,f.jsx)("label",{className:"p-2 text-black font-medium border-b border-black",children:"Description"}),(0,f.jsx)("div",{className:"p-2",children:(0,f.jsx)(c.II,{name:"description",placeholder:"",className:"w-full text-wrap",value:null===e||void 0===e?void 0:e.description,onChange:function(e){var l=e.target.value,r=w;r.lCode[a].description=l,T("lCode",r.lCode)}})})]})]},a)}))})]}),(0,f.jsxs)("div",{className:"py-4 mb-2",children:[(0,f.jsx)("h3",{className:"font-bold mb-2 text-center",children:"Diagnosis"}),(0,f.jsx)("div",{className:"overflow-visible border-y border-black",children:null===w||void 0===w||null===(a=w.icd)||void 0===a?void 0:a.map((function(e,a){var l,r;return(0,f.jsxs)("div",{className:"flex",children:[(0,f.jsxs)("div",{className:"flex flex-col border-r border-black",children:[0===a&&(0,f.jsx)("label",{className:"p-2 text-black font-medium border-b border-black",children:"ICD"}),(0,f.jsx)("div",{className:"p-2 ".concat(a!==(null===w||void 0===w||null===(l=w.icd)||void 0===l?void 0:l.length)-1?"border-b border-black":""),children:(0,f.jsx)(c.II,{name:"code",placeholder:"ICD",className:"w-[100px]",value:null===e||void 0===e?void 0:e.code,onChange:function(e){var l=e.target.value,r=w;r.icd[a].code=l,T("icd",r.icd)}})})]}),(0,f.jsxs)("div",{className:"flex flex-col justify-between flex-1",children:[0===a&&(0,f.jsx)("label",{className:"p-2 text-black font-medium border-b border-black",children:"Description"}),(0,f.jsx)("div",{className:"p-2 ".concat(a!==(null===w||void 0===w||null===(r=w.icd)||void 0===r?void 0:r.length)-1?"border-b border-black":""),children:(0,f.jsx)(c.II,{name:"description",placeholder:"",className:"w-full text-balance",value:null===e||void 0===e?void 0:e.description,onChange:function(e){var l=e.target.value,r=w;r.icd[a].description=l,T("icd",r.icd)}})})]})]},a)}))})]})]}),(0,f.jsxs)("div",{style:{pageBreakBefore:"always",margin:"20px"},children:[(0,f.jsxs)("div",{className:"max-w-4xl mx-auto my-2 border border-black",children:[(0,f.jsx)("h3",{className:"font-bold p-2 text-center",children:"Prescription"}),(0,f.jsx)("div",{className:"overflow-visible",children:(0,f.jsx)("div",{className:"grid grid-cols-3 border-t border-black",children:y.map((function(e,a){return(0,f.jsxs)("div",{className:"".concat([3,4,5,8,9].includes(a)?"border-y border-black":""," ").concat([0,1,3,4,6,8].includes(a)?"border-r border-black":""," flex flex-col ").concat(6===a||8===a?"col-span-2":""),children:[(0,f.jsx)("label",{className:"text-black font-medium border-b border-black p-2",children:e.label}),(0,f.jsx)("div",{className:"p-2",children:(0,f.jsx)(i.gN,{name:e.name,placeholder:e.placeholder,className:"w-full",component:c.II})})]},a)}))})})]}),(0,f.jsx)("div",{className:"text-black my-5",children:"The above procedure and any repair and/or parts to maintain proper fit and function are appropriate for this patient and are deemed medically necessary."}),(0,f.jsxs)("div",{className:"flex flex-col gap-5",children:[(0,f.jsx)("div",{className:"flex justify-between items-center",children:(0,f.jsx)("h4",{children:"Medical Necessity"})}),(0,f.jsx)("div",{children:(0,f.jsx)(i.gN,{className:"w-full",component:c.II,textArea:!0,type:"text",autoComplete:"off",name:"notes",placeholder:"",rows:"10"})})]}),(0,f.jsxs)("div",{className:"uppercase flex justify-between text-black mt-12 font-semibold",children:[(0,f.jsx)("div",{children:"Prescriber Signature"}),(0,f.jsx)("div",{children:"date: ".concat(h()().format(s.zT))})]})]})]})})]})})}}}]);
//# sourceMappingURL=1145.3c9d6c92.chunk.js.map