import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, Image, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');


const AutoCarousel = ({bannerdata}) => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  // 🔁 Auto Scroll
  useEffect(() => {
    if (!Number.isInteger(activeIndex)) return;

    const interval = setInterval(() => {
      const nextIndex =
        activeIndex + 1 < bannerdata?.length ? activeIndex + 1 : 0;

      if (flatListRef.current && nextIndex < bannerdata?.length) {
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setActiveIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={bannerdata}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.img }} style={styles.image} />
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* 🔵 Dots */}
      <View style={styles.dotsContainer}>
        { bannerdata && bannerdata.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width,
    height: 450,
    resizeMode: "cover",
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#F79489',
    width: 12,
  },
});

export default AutoCarousel;
