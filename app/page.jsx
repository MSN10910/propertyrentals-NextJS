import Hero from "@/components/Hero"
import InfoBoxes from "@/components/InfoBoxes"
import HomeProperties from "@/components/HomeProperties"
import FeaturedProperties from "@/components/FeaturedProperties"



const HomePage = () => {
  

  // console.log(process.env.MONGODB_URI);
  return (
    <>
      <Hero />
      <InfoBoxes />
      <FeaturedProperties />
      <HomeProperties />
     
    </>
  )
}

export default HomePage