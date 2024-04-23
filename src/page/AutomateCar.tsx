import React, { useState } from "react";
import styled from "styled-components";
import ModalComponent, { ModalForm } from "../components/Modal";

interface CarProps {
  name?: string;
  img?: string;
}

interface Message {
  title: string;
  message: string;
}

const Component = styled.div`
  display: grid;
  grid-template-columns: max-content 500px max-content;
  align-items: center;
  justify-content: center;
  justify-items: center;
`;

const Row = styled.div<{ $row: number }>`
  width: 500px;
  display: grid;
  grid-template-columns: ${({ $row }) => `repeat(${$row}, 1fr)`};
  gap: 10px;

  & > .title {
    /* Target the 1st and 5th elements */
    grid-column: span 4; /* Apply grid-column: span 4 */
    text-align: center;
    gap: 10px;
  }
`;

const MainText = styled.p`
  font-size: 25px;
  font-weight: 800;
`;

const Title = styled(MainText)`
  text-align: center;
`;

const Slot = styled.div`
  padding: 20px;
  border: 1px solid;
  text-align: center;
  cursor: pointer;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
`;

const AddComponent = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
  border: 2px solid #000;
  padding: 20px;
`;

export const Input = styled.input`
  border: 1px solid black;
  border-radius: 50px;
  padding: 10px;
  width: 480px;
  &:focus {
    outline: none;
  }
`;

const AutomatedCarParkingStation: React.FC = () => {
  const row = 4;
  const count: number = 12;
  const parkSpace: CarProps[] = Array.from(
    { length: (row + count) * 2 },
    (_) => ({
      name: undefined,
      img: undefined,
    })
  );

  const [data, setData] = useState(parkSpace || []);
  const [message, setMessage] = useState<Message | undefined>();
  const [open, setOpen] = useState(false);

  const OnInsertAdd = (
    arr: any[],
    startIndex: number,
    index: number,
    newItem: any[],
    fristPark: boolean
  ) => {
    const result = fristPark
      ? [
          ...arr.slice(startIndex, index), // part of the array before the specified index
          ...newItem.map((item) => item), // increment the values of the inserted items
          ...arr.slice(index),
        ]
      : [
          ...arr.slice(0, startIndex),
          ...newItem.map((item) => item), // increment the values of the inserted items
          ...arr.slice(startIndex, index - 1), // part of the array before the specified index
          ...arr.slice(index, arr.length),
        ];
    return result;
  };

  const handlePark = (no?: string) => {
    const parkLot1 = data.slice(0, 4);
    const parkLot2 = data.slice(16, 20);
    let startIndex = 1;
    let endIndex = 4;
    let parkLot = parkLot1;
    if (
      parkLot1.filter((item) => item.name).length >
      parkLot2.filter((item) => item.name).length
    ) {
      parkLot = parkLot2;
      startIndex = 16;
      endIndex = 20;
    }

    if (
      (parkLot.filter((item) => item.name).length >= 1 &&
        data.slice(4, 8).filter((item) => item.name).length >= 1) ||
      (parkLot.filter((item) => item.name).length >= 1 &&
        data.slice(20, 24).filter((item) => item.name).length >= 1)
    ) {
      return setMessage({
        title: "Warning",
        message: "Please exist all the car first",
      });
    }

    const checked = parkLot.every((value) => value.name);
    if (checked) {
      return setMessage({ title: "Warning", message: "Full space" });
    } else if (!no) {
      return setMessage({
        title: "Warning",
        message: "Please input template number",
      });
    }

    const newData: CarProps[] = [
      {
        name: no,
        img: "https://icones.pro/wp-content/uploads/2021/03/icone-de-voiture-symbole-png-orange.png",
      },
    ];

    setData((preData) => {
      return OnInsertAdd(
        preData,
        startIndex,
        endIndex,
        newData,
        startIndex === 1 ? true : false
      );
    });
  };

  const OnInsert = (arr: any[], index: number, newItem: any[]) => {
    return [
      ...arr.slice(0, index),
      // inserted items
      ...newItem,
      // part of the array after the specified index (excluding the replaced item)
      ...arr.slice(index + newItem?.length),
    ];
  };
  const handleExistPark1 = (item?: CarProps, index?: number) => {
    if (!item?.name || index === undefined) {
      return setMessage({
        title: "Warning",
        message: "Don't have car to exist",
      });
    } else {
      let newIndex = 4;
      if (index > 11) {
        newIndex = 16;
      } else if (index > 7) {
        newIndex = 12;
      } else if (index > 3) {
        newIndex = 8;
      }

      const newData = data.map((car, carIndex) => {
        if (carIndex > index && carIndex < newIndex) {
          car.name = data[newIndex + index - 4 - carIndex]?.name;
          car.img = data[newIndex + index - 4 - carIndex]?.img;
        }
        return car;
      });

      const length = Math.max(newIndex - index, 1); // Ensure non-negative length
      const arrange = parkSpace
        .slice(0, length)
        .concat(newData.slice(newIndex - 8, index - 4));
      setData(OnInsert(newData, newIndex - 8, arrange));
      setMessage({
        title: "Thank you",
        message: `The car's ${item.name} has been exist`,
      });
    }
  };

  const handleExistPark2 = (item?: CarProps, index?: number) => {
    if (!item?.name || index === undefined) {
      return setMessage({
        title: "Warning",
        message: "Don't have car to exist",
      });
    } else {
      let startIndex = 19;
      if (index >= 28) {
        startIndex = 27;
      } else if (index >= 24) {
        startIndex = 23;
      }

      const newData = data.map((car, carIndex) => {
        if (carIndex > startIndex && carIndex < index) {
          car.name = data[startIndex + index - (carIndex + 4)]?.name;
          car.img = data[startIndex + index - (carIndex + 4)]?.img;
        }
        return car;
      });

      const length = Math.max(index - startIndex, 1); // Ensure non-negative length
      const arrange = newData
        .slice(index - 3, startIndex + 1)
        .concat(parkSpace.slice(16, length > 4 ? 16 + 4 : 16 + length));
      setData(OnInsert(newData, startIndex - 3, arrange));
      setMessage({
        title: "Thank you",
        message: `The car's ${item.name} has been exist`,
      });
    }
  };

  return (
    <div>
      {message && (
        <ModalComponent {...message} onClose={() => setMessage(undefined)} />
      )}
      <Component>
        <Row $row={row}>
          <Title className="title">Parking lot 1(Exit)</Title>
          {data &&
            data.slice(0, 16).map((item, index) => (
              <div key={index}>
                <Slot
                  onClick={() => {
                    handleExistPark1(item, index + 4);
                  }}
                >
                  <Image
                    src={
                      item?.img ||
                      "https://cdn3.iconfinder.com/data/icons/cosmo-color-navigation/40/parking_2-512.png"
                    }
                  />
                  <p>{item?.name || "Availability"}</p>
                </Slot>
              </div>
            ))}
        </Row>
        <AddComponent
          src={"https://cdn-icons-png.flaticon.com/512/63/63747.png"}
          onClick={() => setOpen(true)}
        />
        <Row $row={row}>
          <Title className="title">Parking lot 2(Exit)</Title>
          {data &&
            data.slice(16).map((item, index) => {
              return (
                <div key={index + 16}>
                  <Slot
                    onClick={() => {
                      handleExistPark2(item, index + 16 + 4);
                    }}
                  >
                    <Image
                      src={
                        item?.img ||
                        "https://cdn3.iconfinder.com/data/icons/cosmo-color-navigation/40/parking_2-512.png"
                      }
                    />
                    <p>{item?.name || "Availability"}</p>
                  </Slot>
                </div>
              );
            })}
        </Row>
        <MainText>Parking lot 1</MainText>
        <MainText>Exit from the Parking Lot</MainText>
        <MainText>Parking lot 2</MainText>
      </Component>

      <ModalForm
        open={open}
        onClose={(data) => {
          if (data) {
            handlePark(data);
          }
          setOpen(false);
        }}
      />
    </div>
  );
};

export default AutomatedCarParkingStation;
