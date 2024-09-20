"use strict";(self.webpackChunknasp=self.webpackChunknasp||[]).push([[9550],{9494:function(e,n,i){i.d(n,{EY:function(){return o},Fv:function(){return s},ac:function(){return t}});var l=i(74165),d=i(15861),a=i(91181),r=i(14712);function t(e,n){return r.Z.get(e,{params:n}).then((function(e){return null===e||void 0===e?void 0:e.data}))}function s(e,n){return r.Z.post(e,n).then((function(e){return null===e||void 0===e?void 0:e.data}))}function o(e){return u.apply(this,arguments)}function u(){return(u=(0,d.Z)((0,l.Z)().mark((function e(n){return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",a.Z.fetchData({url:"/search/query",method:"post",data:n}));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}},9550:function(e,n,i){i.r(n),i.d(n,{default:function(){return N}});var l=i(29439),d=i(72791),a=i(40018),r=i(16146),t=i(92506),s=i(62797),o=i(9494),u=i(11723),c=i(57689),v=i(4942),m=i(1413),h=i(4481),p=i(86368),f=i(77567),x=i(45115),j=i(31414),Z=i(80184),b=[{label:"Sub Admin",name:"sub-user",read:!0,edit:!1,delete:!1},{label:"Patient Management",name:"patient",read:!0,edit:!1,delete:!1},{label:"Physicians",name:"physician",read:!0,edit:!1,delete:!1},{label:"Patient Prescriptions",name:"service-order",read:!0,edit:!1,delete:!1},{label:"Insurance Companies",name:"insurance",read:!0,edit:!1,delete:!1},{label:"Codes (LCode / ICD)",name:"codes",read:!0,edit:!1,delete:!1},{label:"Types Of Devices",name:"types-of-devices",read:!0,edit:!1,delete:!1},{label:"Locations",name:"locations",read:!0,edit:!1,delete:!1}],y=function(e){e.touched,e.errors;var n=e.values,i=e.setFieldValue,l=function(e,l,d){var a=((null===n||void 0===n?void 0:n.roles)||[]).map((function(n){var i;return(null===n||void 0===n?void 0:n.name)===d?"edit"!==e&&"delete"!==e||!l?(0,m.Z)((0,m.Z)({},n),{},(0,v.Z)({},e,l)):(0,m.Z)((0,m.Z)({},n),{},(i={},(0,v.Z)(i,e,l),(0,v.Z)(i,"read",!0),i)):n}));i("roles",a)};return(0,Z.jsxs)("div",{children:[(0,Z.jsx)("h4",{className:"my-4",children:"Access Control"}),(0,Z.jsxs)(r.iA,{children:[(0,Z.jsx)(x.Z,{children:(0,Z.jsxs)(j.Z,{children:[(0,Z.jsx)(f.Z,{children:"Menu"}),(0,Z.jsx)(f.Z,{children:"Read"}),(0,Z.jsx)(f.Z,{children:"Add/Edit"}),(0,Z.jsx)(f.Z,{children:"Delete"})]})}),(0,Z.jsx)(h.Z,{children:null===b||void 0===b?void 0:b.map((function(e,i){var d,a=null===n||void 0===n||null===(d=n.roles)||void 0===d?void 0:d.find((function(n){return(null===n||void 0===n?void 0:n.name)===(null===e||void 0===e?void 0:e.name)}));return(0,Z.jsxs)(j.Z,{children:[(0,Z.jsxs)(p.Z,{children:[null===e||void 0===e?void 0:e.label," "]}),(0,Z.jsx)(p.Z,{children:(0,Z.jsx)(r.XZ,{checked:null===a||void 0===a?void 0:a.read,onChange:function(n){return l("read",n,null===e||void 0===e?void 0:e.name)}})}),(0,Z.jsx)(p.Z,{children:(0,Z.jsx)(r.XZ,{checked:null===a||void 0===a?void 0:a.edit,onChange:function(n){return l("edit",n,null===e||void 0===e?void 0:e.name)}})}),(0,Z.jsx)(p.Z,{children:(0,Z.jsx)(r.XZ,{checked:null===a||void 0===a?void 0:a.delete,onChange:function(n){return l("delete",n,null===e||void 0===e?void 0:e.name)}})})]},i)}))})]})]})},A=i(60364),g=s.Ry().shape({name:s.Z_().required("Required"),email:s.Z_().email().required("Required")}),C={name:"",email:"",superAdmin:!1,roles:b},N=function(){var e=(0,d.useRef)(),n=(0,d.useState)(!1),i=(0,l.Z)(n,2),s=i[0],v=i[1],m=(0,d.useState)(),h=(0,l.Z)(m,2),p=h[0],f=h[1],x=(0,c.UO)().id,j=(0,c.s0)(),N=(0,A.v9)((function(e){var n;return null===e||void 0===e||null===(n=e.auth)||void 0===n?void 0:n.user})).superAdmin;(0,d.useEffect)((function(){x&&(0,o.ac)(u.vh.LIST_DATA,{type:u.kD.ADMINS,id:x}).then((function(e){var n,i=null===e||void 0===e||null===(n=e.data)||void 0===n?void 0:n.data;i.superAdmin=!!i.superAdmin,i.roles=i.roles?i.roles:b,f(i)}))}),[x]);return(0,Z.jsx)(a.lG,{children:(0,Z.jsx)(t.J9,{innerRef:e,initialValues:p||C,validationSchema:g,onSubmit:function(e){var n=e.name,i=e.id,l=e.email,d=e.roles,a=e.superAdmin;v(!0);var t=new FormData;t.append("name",n),t.append("email",l),t.append("superAdmin",a),t.append("roles",null!==d&&void 0!==d&&d.length?JSON.stringify(d):JSON.stringify(b)),i&&t.append("adminId",i),(0,o.Fv)(u.vh.ADD_EDIT_ADMINS,t).then((function(){j(-1),r.Am.push((0,Z.jsx)(r.P_,{type:"success",children:"Sub admin saved!"}))})).finally((function(){return v(!1)}))},enableReinitialize:!0,children:function(e){var n=e.errors,i=e.touched,l=e.setFieldValue,d=e.isSubmitting,a=e.values;return(0,Z.jsxs)(t.l0,{className:"p-5",children:[(0,Z.jsxs)("div",{className:"flex mb-3 justify-end w-3/4",children:[(0,Z.jsx)(r.zx,{size:"sm",variant:"solid",onClick:function(){return j(-1)},type:"button",children:"Cancel"}),(0,Z.jsx)(r.zx,{size:"sm",variant:"solid",style:{marginLeft:"5px"},loading:d,type:"submit",children:x?"Update":"Save"})]}),s&&(0,Z.jsx)("div",{className:"flex justify-center",children:(0,Z.jsx)(r.$j,{size:"3.25rem"})}),!s&&(0,Z.jsx)(r.Zb,{className:"mt-2.5 w-3/4 ",children:(0,Z.jsxs)(r.Yb,{children:[(0,Z.jsx)(r.xJ,{label:"Name",invalid:(null===n||void 0===n?void 0:n.name)&&(null===i||void 0===i?void 0:i.name),errorMessage:null===n||void 0===n?void 0:n.name,children:(0,Z.jsx)(t.gN,{type:"text",autoComplete:"off",name:"name",placeholder:"Enter name ",component:r.II})}),(0,Z.jsx)(r.xJ,{label:"Email",invalid:(null===n||void 0===n?void 0:n.email)&&(null===i||void 0===i?void 0:i.email),errorMessage:null===n||void 0===n?void 0:n.email,children:(0,Z.jsx)(t.gN,{type:"email",autoComplete:"off",name:"email",placeholder:"Enter Email",component:r.II})}),N&&(0,Z.jsxs)(Z.Fragment,{children:[(0,Z.jsxs)("div",{className:"flex justify-between",children:[(0,Z.jsx)("p",{className:"font-semibold",children:"Is Super Admin?"}),(0,Z.jsx)(r.T5,{name:"superAdmin",checked:null===a||void 0===a?void 0:a.superAdmin,onChange:function(e){console.log("checked",e),l("superAdmin",!e)}})]}),!(null!==a&&void 0!==a&&a.superAdmin)&&(0,Z.jsx)(y,{setFieldValue:l,values:a})]})]})})]})}})})}}}]);
//# sourceMappingURL=9550.7ac465be.chunk.js.map