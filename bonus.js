// LeetCode: Remove Element
// Return the number of elements not equal to val; first k items contain kept values.
var removeElement = function(nums, val) {
  let k = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[k] = nums[i];
      k++;
    }
  }
  return k;
};

// Example:
// const nums = [3, 2, 2, 3];
// const k = removeElement(nums, 3);
// console.log(k, nums.slice(0, k)); // 2 [2, 2]

module.exports = removeElement;