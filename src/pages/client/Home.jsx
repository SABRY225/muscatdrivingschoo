import React from "react";
import DownloadApp    from "../../components/client/home/DownloadApp";
import Footer         from "../../components/client/home/Footer";
import HomeAbout      from "../../components/client/home/HomeAbout";
import HomeBanner     from "../../components/client/home/HomeBanner";
import HomeImages     from "../../components/client/home/HomeImages";
import HomeQuestions  from "../../components/client/home/HomeQuestions";
import HomeWorks      from "../../components/client/home/HomeWorks";
import LinksFooter    from "../../components/client/home/LinksFooter";
import HomePackage    from "../../components/client/home/HomePackage";
import Teachers       from "../../components/client/home/Teachers";
import HomeLecture    from "../../components/client/home/HomeLecture";
import HomeComment    from "../../components/client/home/RatingTeachers";
import HomeDiscounts    from "../../components/client/home/Discounts";
import HomeNews       from "../../components/client/home/HomeNews";
import HomeAds        from "../../components/client/home/Ads";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import MapBrowsing from "../../components/client/home/MapBrowsing";
import InteractiveSystemInfoSection from "./InteractiveSystemInfoSection";
import DiscountSection from "./DiscountSection";
import RescourceSection from "./RescourceSection";
import ExamSection from "./ExameSection";
import FeaturesSection from "../../components/client/home/HomeImages";
import { useDataHome } from "../../hooks/useDataHome";
import HomeExam from "./ExameSection";
import Discounts from "./Discounts";

export default function Home() {
  const { student } = useSelector((state) => state.student);
  const { data } = useDataHome();

  const {
    lectures = [],
    packages = [],
    exams = [],
    discounts = [],
    advertisements = [],
    news = [],
  } = data || {};
  console.log(exams);
  
  return (
    <Navbar>
      {student && student.lat && student.long && <MapBrowsing />}
      <HomeBanner />
      <FeaturesSection />
      {lectures.length > 0 && <HomeLecture lectures={lectures} />}
      {packages.length > 0 && <HomePackage packages={packages} />}
      {exams.length > 0 && <HomeExam exams={exams} />}
      {discounts.length > 0 && <Discounts discounts={discounts} />}
      {advertisements.length > 0 && <HomeAds ads={advertisements} />}
      {news.length > 0 && <HomeNews news={news} />}


      {/* باقي الأقسام */}
      <HomeWorks />
      <HomeQuestions />
      <DownloadApp />
      <LinksFooter />
      <Footer />
    </Navbar>
  );
}

