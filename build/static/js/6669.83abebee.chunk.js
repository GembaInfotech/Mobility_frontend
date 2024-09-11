"use strict";(self.webpackChunknasp=self.webpackChunknasp||[]).push([[6669],{25764:function(e,n,i){i(72791);var l=i(73038),o=i(80184);n.Z=function(e){var n=e.header,i=e.des,t=e.onDialogClose,a=e.isWarning,r=e.onConfirmClick,d=e.isOpen,s=e.buttonLabel;return(0,o.jsx)(l.Vq,{isOpen:d,onClose:t,onRequestClose:t,contentClassName:"pb-0 px-0 mt-36 min-w-36",children:(0,o.jsxs)("div",{className:"px-5 pb-5",children:[(0,o.jsx)("h5",{className:"mb-4",children:n}),(0,o.jsx)("p",{children:i}),a&&(0,o.jsx)("p",{className:"text-red-700",children:a}),(0,o.jsxs)("div",{className:"text-right mt-6",children:[(0,o.jsx)(l.zx,{className:"ltr:mr-2 rtl:ml-2",variant:"plain",onClick:t,children:"Cancel"}),(0,o.jsx)(l.zx,{variant:"solid",onClick:r,children:s})]})]})})}},52452:function(e,n,i){var l=i(23532),o=i(73038),t=i(80184);n.Z=function(e){var n=e.row,i=e.onActionHandle,a=e.actionsMenu,r=(0,l.Z)().textTheme;return(0,t.jsx)("div",{className:"flex items-center justify-between",children:null===a||void 0===a?void 0:a.map((function(e,l){var a,d;if(null===(a=null===e||void 0===e||null===(d=e.show)||void 0===d?void 0:d.call(e))||void 0===a||a)return(0,t.jsx)(o.u,{title:null===e||void 0===e?void 0:e.toolTip,visible:!(null===e||void 0===e||!e.toolTip),children:null!==e&&void 0!==e&&e.isImage?(0,t.jsx)("img",{src:e.label,alt:"view Icon",style:{maxWidth:"20px"},className:"cursor-pointer mx-0.5",onClick:function(l){return i(l,e.key,n)}}):(0,t.jsx)("span",{className:"".concat(r," cursor-pointer select-none font-semibold ml-2 "),onClick:function(l){return i(l,e.key,n)},children:e.label})})}))})}},31673:function(e,n,i){i(72791);var l=i(52639),o=i(73038),t=i(80184);n.Z=function(e){var n,i,a=e.dataObj,r=e.setSelectedData,d=e.setActiveConfirm,s=e.setOpenModal,u=null===a||void 0===a||null===(n=a.row)||void 0===n||null===(i=n.original)||void 0===i?void 0:i._id,c=l.uN.find((function(e,n){var i,l;return e.identifier===(null===a||void 0===a||null===(i=a.row)||void 0===i||null===(l=i.original)||void 0===l?void 0:l.status)}));return(0,t.jsx)(o.XZ,{checked:null===c||void 0===c?void 0:c.value,onChange:function(e){return function(e,n,i){var l="";1===n&&(l=2),2===n&&(l=1),r({id:i,action:l}),d(!0),s(!0)}(0,null===c||void 0===c?void 0:c.identifier,u)}})}},10515:function(e,n,i){i(72791);var l=i(73038),o=i(58617),t=i(48573),a=i.n(t),r=i(80184);n.Z=function(e){var n=e.onChange,i=e.placeholder,t=a()((function(e){null===n||void 0===n||n(e)}),500);return(0,r.jsx)(l.II,{className:"max-w-md md:w-96 mb-4",size:"sm",placeholder:i?"".concat(i):"Filter by NAL, LCode, Referring Physician",prefix:(0,r.jsx)(o.O6C,{className:"text-lg"}),onChange:function(e){t(e.target.value)}})}},9494:function(e,n,i){i.d(n,{EY:function(){return s},Fv:function(){return d},ac:function(){return r}});var l=i(74165),o=i(15861),t=i(91181),a=i(14712);function r(e,n){return a.Z.get(e,{params:n}).then((function(e){return null===e||void 0===e?void 0:e.data}))}function d(e,n){return a.Z.post(e,n).then((function(e){return null===e||void 0===e?void 0:e.data}))}function s(e){return u.apply(this,arguments)}function u(){return(u=(0,o.Z)((0,l.Z)().mark((function e(n){return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",t.Z.fetchData({url:"/search/query",method:"post",data:n}));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}},26669:function(e,n,i){i.r(n),i.d(n,{default:function(){return Z}});var l=i(29439),o=i(72791),t=i(9494),a=i(11723),r=i(40018),d=i(10515),s=i(58617),u=i(73038),c=i(47511),v=i(80184),m=function(e){var n=e.setSearch,i=e.addButtonClick;return(0,v.jsxs)(v.Fragment,{children:[(0,c.ZP)(c.Fm.INSURANCES,c.qz.WRITE)&&(0,v.jsx)("div",{className:"md:flex items-center justify-end",children:(0,v.jsx)(u.zx,{size:"sm",variant:"solid",onClick:i,icon:(0,v.jsx)(s.HQD,{}),children:"Add Insurance"})}),(0,v.jsx)(d.Z,{onChange:function(e){return n(e)}})]})},h=i(78820),f=i(25764),p=i(52639),x=i(92506),b=i(62797),C=i(75737),j=i.n(C),N=(i(70902),[{label:"Name",type:"text",name:"name",placeholder:"Enter insurance name",component:u.II,isBasic:!0},{name:"phoneNumber",countryCode:"countryCode",label:"Mobile No.",component:"phoneNumber",placeholder:"Enter mobile no."},{label:"Email",name:"email",placeholder:"Enter Email",component:u.II,isBasic:!0},{label:"Address",name:"address",placeholder:"Enter Address",component:u.II,isBasic:!0}]),E=b.Ry().shape({name:b.Z_().required("Required"),email:b.Z_().email().required("Required"),phoneNumber:b.Z_().required("Required"),address:b.Z_().required("Required")}),g={name:"",email:"",phoneNumber:"",countryCode:"+1",address:""},y=function(e){var n=e.closeAddEdit,i=e.selectedRow;return(0,v.jsx)(r.lG,{children:(0,v.jsx)(x.J9,{initialValues:i||g,validationSchema:E,onSubmit:function(e,l){var o,r,d=l.setSubmitting,s={};s.phoneNumber=null===e||void 0===e||null===(o=e.phoneNumber)||void 0===o?void 0:o.replace(null===e||void 0===e?void 0:e.countryCode,""),null!==e&&void 0!==e&&null!==(r=e.countryCode)&&void 0!==r&&r.includes("+")||(s.countryCode="+".concat(e.countryCode)),""===e.phoneNumber&&delete s.phoneNumber,i&&(s.id=i._id),s.name=null===e||void 0===e?void 0:e.name,s.email=null===e||void 0===e?void 0:e.email,s.address=null===e||void 0===e?void 0:e.address,(0,t.Fv)(a.vh.ADD_EDIT_INSURANCE,s).then((function(e){u.Am.push((0,v.jsx)(u.P_,{type:"success",children:"Saved successfully"}))})).finally((function(){n(),d(!1)}))},enableReinitialize:!0,children:function(e){var l=e.errors,o=e.touched,t=e.values,a=e.isSubmitting,r=e.setFieldValue;return(0,v.jsxs)(x.l0,{className:"p-5",children:[(0,v.jsxs)("div",{className:"flex mb-3 justify-between w-3/4",children:[(0,v.jsx)("h3",{children:i?"Edit Insurance":"Add Insurance"}),(0,v.jsxs)("div",{className:"flex",children:[(0,v.jsx)(u.zx,{size:"sm",className:"ltr:mr-3 rtl:ml-3",onClick:n,icon:(0,v.jsx)(h.SV5,{}),type:"button",children:"Cancel"}),(0,v.jsx)(u.zx,{size:"sm",variant:"solid",loading:a,icon:(0,v.jsx)(h.JMf,{}),type:"submit",children:i?"Update":"Save"})]})]}),(0,v.jsx)("div",{children:(0,v.jsx)(u.Zb,{className:"mt-2.5 w-3/4 ",children:(0,v.jsx)(u.Yb,{className:" md:w-full lg:w-1/2",children:N.map((function(e,n){return(0,v.jsx)(u.xJ,{label:null===e||void 0===e?void 0:e.label,invalid:(null===l||void 0===l?void 0:l[e.name])&&(null===o||void 0===o?void 0:o[e.name]),errorMessage:null===l||void 0===l?void 0:l[e.name],children:null!==e&&void 0!==e&&e.isBasic?(0,v.jsx)(x.gN,{type:e.type,autoComplete:"off",onWheel:function(n){return null!==e&&void 0!==e&&e.isWheel?n.target.blur():""},value:null===t||void 0===t?void 0:t[e.name],name:e.name,placeholder:e.placeholder,component:null===e||void 0===e?void 0:e.component}):(0,v.jsx)(v.Fragment,{children:"phoneNumber"===(null===e||void 0===e?void 0:e.component)&&(0,v.jsx)(j(),{inputStyle:{width:"369px",padding:"11px 14px 11px 60px"},enableSearch:!0,country:"us",countryCodeEditable:!0,value:"".concat(null===t||void 0===t?void 0:t[e.name]),onChange:function(n,i){r(e.name,n),r(e.countryCode,null===i||void 0===i?void 0:i.dialCode)}})})},n)}))})})})]})}})})},S=i(31673),w=i(52452),A=[{label:"Edit",key:p.A6.EDIT,show:function(){return(0,c.ZP)(c.Fm.INSURANCES,c.qz.WRITE)}},{label:(0,v.jsx)(h.YK6,{style:{fontSize:"1.2rem"}}),key:p.A6.DELETE,toolTip:"Delete",show:function(){return(0,c.ZP)(c.Fm.INSURANCES,c.qz.DELETE)}}],Z=function(){var e=(0,o.useState)([]),n=(0,l.Z)(e,2),i=n[0],d=n[1],s=(0,o.useState)(!0),h=(0,l.Z)(s,2),x=h[0],b=h[1],C=(0,o.useState)(""),j=(0,l.Z)(C,2),N=j[0],E=j[1],g=(0,o.useState)(1),Z=(0,l.Z)(g,2),I=Z[0],D=Z[1],k=(0,o.useState)(0),R=(0,l.Z)(k,2),F=R[0],T=R[1],z=(0,o.useState)(10),L=(0,l.Z)(z,2),_=L[0],q=L[1],B=(0,o.useState)(!1),H=(0,l.Z)(B,2),O=H[0],P=H[1],M=(0,o.useState)(""),U=(0,l.Z)(M,2),W=U[0],V=U[1],G=(0,o.useState)(!1),J=(0,l.Z)(G,2),Y=J[0],K=J[1],Q=(0,o.useState)(!1),X=(0,l.Z)(Q,2),$=X[0],ee=X[1],ne=(0,o.useState)(""),ie=(0,l.Z)(ne,2),le=(ie[0],ie[1]),oe=(0,o.useState)(!1),te=(0,l.Z)(oe,2),ae=te[0],re=te[1];(0,o.useEffect)((function(){(0,t.ac)(a.vh.LIST_DATA,{type:a.kD.INSURANCES,limit:_,search:N,skip:_*(I-1)}).then((function(e){var n,i;d(null===e||void 0===e||null===(n=e.data)||void 0===n?void 0:n.data),T(null===e||void 0===e||null===(i=e.data)||void 0===i?void 0:i.count)})).finally((function(){return b(!1)}))}),[N,I,_,$]);var de=function(e,n,i){V(i),n===p.A6.EDIT&&(i.phoneNumber=(null===i||void 0===i?void 0:i.countryCode)+(null===i||void 0===i?void 0:i.phoneNumber),P(!0)),n===p.A6.DELETE&&K(!0)},se=function(){K(!1),V(""),re(!1)},ue={header:p.BI.HEADER,des:p.BI.DELETE,buttonLabel:"Delete"},ce=[{Header:"Company Name",Cell:function(e){var n,i=null===e||void 0===e||null===(n=e.row)||void 0===n?void 0:n.original;return(0,v.jsx)("div",{className:"flex items-center w-40",children:null===i||void 0===i?void 0:i.name})}},{Header:"Address",accessor:"address",Cell:function(e){var n,i=null===e||void 0===e||null===(n=e.row)||void 0===n?void 0:n.original;return(0,v.jsx)("div",{className:"flex items-center w-40",children:null===i||void 0===i?void 0:i.address})}},{Header:"Mobile",accessor:"mobile",Cell:function(e){var n,i=null===e||void 0===e||null===(n=e.row)||void 0===n?void 0:n.original;return(0,v.jsxs)("div",{className:"flex items-center w-40",children:[null===i||void 0===i?void 0:i.countryCode," - ",null===i||void 0===i?void 0:i.phoneNumber]})}},{Header:"Email",accessor:"email",Cell:function(e){var n,i=null===e||void 0===e||null===(n=e.row)||void 0===n?void 0:n.original;return(0,v.jsx)("div",{className:"flex items-center w-40",children:null===i||void 0===i?void 0:i.email})}},{Header:"Active",Cell:function(e){return(0,v.jsx)(S.Z,{dataObj:e,setSelectedData:le,setActiveConfirm:re,setOpenModal:K})}},{Header:"Actions",id:"action",accessor:function(e){return e},Cell:function(e){return(0,v.jsx)(w.Z,{row:e.row.original,onActionHandle:de,actionsMenu:A})}}];return(0,v.jsx)(v.Fragment,{children:O?(0,v.jsx)(y,{closeAddEdit:function(){P(!1),ee(!$),V("")},selectedRow:W}):(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(m,{setSearch:E,addButtonClick:function(){return P(!0)}}),(0,v.jsx)(r.lG,{className:"h-full",bodyClass:"h-full",children:(0,v.jsx)(r.wQ,{columns:(0,c._P)(ce,c.Fm.INSURANCES,1),data:i,loading:x,skeletonAvatarColumns:[0],skeletonAvatarProps:{width:28,height:28},pagingData:{pageIndex:I,pageSize:_,total:F},onPaginationChange:function(e){return D(e)},onSelectChange:function(e){return q(e)}})}),(0,v.jsx)(f.Z,{isOpen:Y,onConfirmClick:function(){var e;console.log("selectedRow",W);var n={type:a.kD.INSURANCES,id:null===W||void 0===W?void 0:W._id};ae?(e=p.D5,n.status=+(null===W||void 0===W?void 0:W.action)):(e=p.O7,n.status=0),(0,t.Fv)(a.vh.BLOCK_DELETE_DATA,n).then((function(n){u.Am.push((0,v.jsx)(u.P_,{type:"success",children:e})),ee((function(e){return!e})),se()}))},header:ue.header,des:ae?null===p.uF||void 0===p.uF?void 0:p.uF.des:p.BI.DELETE,isWarning:!ae&&p.BI.WARNING,onDialogClose:se,buttonLabel:ae?null===p.uF||void 0===p.uF?void 0:p.uF.buttonLabel:ue.buttonLabel})]})})}}}]);
//# sourceMappingURL=6669.83abebee.chunk.js.map