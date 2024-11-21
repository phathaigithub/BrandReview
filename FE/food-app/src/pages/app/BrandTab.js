// BrandTab.js
import React from "react";
import Cards from "../../components/Layouts/Cards";
import { useState} from "react";
import { Row } from "react-bootstrap";


const BrandTab = ({ brandData, renderRatingIcons, type }) => {
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [district, setDistrict] = useState(""); // State for selected district
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
  }
  const normalizeText = (text) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  };
 
  const filteredBrands = brandData.filter((brand) => {
    const matchesSearch =
      normalizeText(brand.name.toLowerCase()).includes(normalizeText(searchQuery.toLowerCase())) ||
      normalizeText(brand.location.toLowerCase()).includes(normalizeText(searchQuery.toLowerCase())) ||
      normalizeText(brand.phone.toLowerCase()).includes(normalizeText(searchQuery.toLowerCase()));
    const matchesDistrict = district === "" || normalizeText(brand.location.toLowerCase()).includes(normalizeText(district.toLowerCase()));
    const matchesType = brand.type.name === type || type === "";

    return matchesSearch && matchesDistrict && matchesType;
  });
  return (
    <>
      <Row className="toolbar bg-white mx-3 mb-3 p-2">
        <div class="col-5">
          <input class="form-control rounded-0" name="brandName" type="text" placeholder="Tìm kiếm bằng tên, địa chỉ,..." onChange={handleSearchChange}></input>
        </div>
        <div class="col-3">
          <select class="form-select rounded-0" onChange={handleDistrictChange} aria-label="Default select example">
            <option value="" selected>Chọn Quận</option>
            <option value="Quận 1">Quận 1</option>
            <option value="Quận 2">Quận 2</option>
            <option value="Quận 3">Quận 3</option>
            <option value="Quận 4">Quận 4</option>
            <option value="Quận 5">Quận 5</option>
            <option value="Quận 6">Quận 6</option>
            <option value="Quận 7">Quận 7</option>
            <option value="Quận 8">Quận 8</option>
            <option value="Quận 9">Quận 9</option>
            <option value="Quận 10">Quận 10</option>
            <option value="Quận 11">Quận 11</option>
            <option value="Quận 12">Quận 12</option>
            <option value="Quận Phú Nhuận">Quận Phú Nhuận</option>
            <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
            <option value="Quận Tân Bình">Quận Tân Bình</option>
            <option value="Quận Tân Phú">Quận Tân Phú</option>
            <option value="Quận Gò Vấp">Quận Gò Vấp</option>
            <option value="Quận Bình Tân">Quận Bình Tân</option>
          </select>
        </div>
      </Row>
      {filteredBrands.map((brand) => (
        <Cards
          key={brand.id}
          id={brand.id}
          name={brand.name}
          image={brand.image}
          status={brand.status}
          priority={brand.priority}
          phone={brand.phone}
          google={brand.google}
          location={brand.location}
          facebook={brand.facebook}
          slug={brand.slug}
          rating={brand.rating || 0}
          type={brand.type}
          reviews={brand.reviews}
          renderRatingIcons={renderRatingIcons}
        />
      ))}
    </>
  );
};

export default BrandTab;
