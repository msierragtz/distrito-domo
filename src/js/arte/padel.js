/* ===== PÁDEL ===== */
function courtWalls(gx,gy,h,glass){const F4=edges4(gx,gy,.06);const fr=(a,b)=>{const A=up(a,h),B=up(b,h);poly([a,b,B,A],glass,true);line(A[0],A[1],B[0],B[1],'#e9eef2')};
  return{back:()=>{fr(...F4[0]);fr(...F4[1])},front:()=>{fr(...F4[2]);fr(...F4[3])}}}
function net(gx,gy){const n1=P(gx+.5,gy+.06),n2=P(gx+.5,gy+.94);poly([n1,n2,up(n2,2),up(n1,2)],'rgba(20,20,20,.75)');line(n1[0],n1[1]-2,n2[0],n2[1]-2,'#ffffff')}
