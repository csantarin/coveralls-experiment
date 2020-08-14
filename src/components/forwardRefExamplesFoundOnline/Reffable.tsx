export {};

// Typescript use of React.forwardRef.
// Tried this but it wasn't very useful.
// https://gist.github.com/Venryx/7cff24b17867da305fff12c6f8ef6f96
// import {forwardRef, useImperativeHandle, ForwardRefExoticComponent, RefAttributes, Ref} from "react";

// export type Handle<T> = T extends ForwardRefExoticComponent<RefAttributes<infer T2>> ? T2 : never;

// export const Parent = (props: {})=> {
//   let childHandle: Handle<typeof Child>;
//   return (
//     <div onClick={()=>childHandle.SayHi()}>
//       <Child name="Bob" ref={c=>childHandle = c}/>
//     </div>
//   );
// };

// export const Child = forwardRef((props: {name: string}, ref: Ref<{SayHi}>)=> {
//   const {name} = props;
//   // expose internal functions; what we return in the callback below is what gets sent to the "ref" callback in Parent
//   useImperativeHandle(ref, () => ({ SayHi }));
  
//   function SayHi() { console.log("Saying hello from: " + name); }
  
//   return <div>{name}</div>;
// });
