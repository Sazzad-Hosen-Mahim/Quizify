import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import useAxiosSecure from "../useAxios";
import { useToken } from "../TokenContext";

const usePostMutate = (route, onSuccess = () => {}, onError = () => {}) => {
  const Axios = useAxiosSecure();
  const token = Cookies.get("user");
  const queryClient = useQueryClient();

  const { approvalToken } = useToken();

  const { mutate, isPending } = useMutation({
    mutationFn: (obj) =>
      Axios.post(route, obj, {
        headers: {
          Authorization: approvalToken || token,
        },
      }),
    onSuccess: (mutatedData) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["test"] });
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });

      // console.log(mutatedData);
      onSuccess(mutatedData.data);
    },
    onError: (err) => {
      // console.log(err);
      onError(err);
    },
  });

  return { mutate, isPending };
};

export default usePostMutate;
