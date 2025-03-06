import { getBookedDatesByCabinId, getCabin } from '@/app/_lib/data-service';

export async function GET(request, {params}) {
  console.log('GET response test');
  // console.log(request);
  // console.log(params);
  const { cabinId } = await params;
  // return Response.json({message: "GET response test"});
  try {
     const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId),
        getBookedDatesByCabinId(cabinId),
      ]);
   
    // return Response.json({cabin, bookedDates});
    if (cabin) {
      console.log('from route.js', cabin, bookedDates);
      return Response.json({
        cabin,
        bookedDates
      });
    }
     
  } catch (error) {
    // console.error(error);
    return Response.json(`Cabin ${cabinId} could not be loaded`);
    
  }
}