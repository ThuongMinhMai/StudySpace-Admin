import { z } from 'zod'
export const RoomNameSchema = z.object({
	roomName: z
		.string()
		.min(2, 'Tên phòng phải nhiều hơn 2 kí tự')
		.max(40, 'Tên phòng ít hơn 40 kí tự')
})

export const amitySchema = z.object({
	amityName: z.string().min(2, 'Tên tiện ích phải nhiều hơn 2 kí tự'),
	type: z.string().min(1, 'Loại tiện ích không được để trống'),
	quantity: z.number().min(0, 'Số lượng không được nhỏ hơn 0'),
	description: z.string().optional()
})
export const AddAmytiSchema = z.object({
    name: z.string().min(1, { message: "Tên không được để trống" }),
    type: z.string().min(1, { message: "Loại không được để trống" }), 
    quantity: z.number().nonnegative({ message: "Số lượng phải là số không âm" }), 
    description: z.string().optional(), 
});