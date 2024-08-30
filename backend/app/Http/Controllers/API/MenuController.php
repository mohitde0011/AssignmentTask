<?php
namespace App\Http\Controllers\API;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Http\Controllers\Controller;
use App\Models\Menu;
use Validator;

class MenuController extends Controller
 {
    public $successStatus = 200;
    public $errorStatus = 400;
    public $unauthorizedAccessStatus = 401;
    public $noRecordFoundStatus = 404;
    public $internalServerStatus = 500;
    public $cacheMaxTime = 60;
    public $menus = [];
    public $level = 0;

    public function getAllMenuTree(Request $request){
        try {
           
            $input = $request->all();
            // Redis caching
            $cacheKey = 'all_menus_'.md5(json_encode($input));

            // Check if data exists in cache
            if (Cache::has($cacheKey)) {
                //return Cache::get($cacheKey);
            }
            
            $menu = Menu::where('status','1')->orderBy('id', 'asc')->get();
            $parents = $menu->where('parent_id', 0);
            $items = self::tree($parents, $menu);
            //echo "<pre>";print_r($items);exit;

            $response = ['status' => true, 'data' => $items];
            // Cache the retrieved data
            Cache::put($cacheKey, $response, now()->addMinutes($this->cacheMaxTime));
            
            return response()->json($response, $this->successStatus);

        } catch (\Exception $ex) {
            $response = ['status' => false, 'message' => $ex];
            return response()->json($response, $this->internalServerStatus);
        }
    }
    

    public function tree($items, $all_items)
    {
        $data_arr = array();
        foreach ($items as $i => $item) {
            //$data_arr[$i] = $item->toArray(); 
            $data_arr[$i]['id'] = $item->id; 
            $data_arr[$i]['name'] = $item->title; 
            $find = $all_items->where('parent_id', $item->id);
            if ($find->count()) {
                
                $data_arr[$i]['children'] = self::tree($find, $all_items);
            }
        }
        return $data_arr;
    }

    public function getMenu($id, Request $request){
        try {
           
            $input = $request->all();
            // Redis caching
            $cacheKey = 'menu_'.$id.'_'.md5(json_encode($input));

            // Check if data exists in cache
            if (Cache::has($cacheKey)) {
                return Cache::get($cacheKey);
            }
             
            $menu = Menu::where('id',$id)->where('status','1')->first();
            if(!empty($menu)){
                $item['id'] = $menu->id; 
                $item['name'] = $menu->title;
                $item['parent'] = $menu->parent_id;
                $item['depth'] = $menu->depth;
                $response = ['status' => true, 'data' => $item];
            } else {
                $response = ['status' => false, 'message' => 'Menu not found!'];
            }
            // Cache the retrieved data
            Cache::put($cacheKey, $response, now()->addMinutes($this->cacheMaxTime));
            
            return response()->json($response, $this->successStatus);

        } catch (\Exception $ex) {
            $response = ['status' => false, 'message' => $ex];
            return response()->json($response, $this->internalServerStatus);
        }
    }

    public function getParentMenus($id, Request $request){
        try {
            $input = $request->all();
            // Redis caching
            $cacheKey = 'parent_menus_'.$id.'_'.md5(json_encode($input));

            // Check if data exists in cache
            if (Cache::has($cacheKey)) {
                return Cache::get($cacheKey);
            }
             
            $menu = Menu::where('id',$id)->where('status','1')->first();
            if(!empty($menu)){
                $menu = Menu::where('id','!=',$menu->id)->where('status','1')->orderBy('id', 'asc')->get();
                $parents = $menu->where('parent_id', 0);
                $items = self::tree($parents, $menu);
                $response = ['status' => true, 'data' => $items];
            } else {
                $response = ['status' => false, 'message' => 'Menu not found!'];
            }
            // Cache the retrieved data
            Cache::put($cacheKey, $response, now()->addMinutes($this->cacheMaxTime));
            
            return response()->json($response, $this->successStatus);

        } catch (\Exception $ex) {
            $response = ['status' => false, 'message' => $ex];
            return response()->json($response, $this->internalServerStatus);
        }
    }

    public function addMenu(Request $request) {
        try {
                $rules = [
                    'name' => 'required|max:250',
                    'parent' => 'required|integer',
                    'depth' => 'required|integer',
                ];
                $validator = Validator::make($request->all(), $rules, []);
                if ($validator->fails()) {
                    $errors = $validator->errors();
                    $response = [
                        'status' => false,
                        'message' => $errors->first(),
                        'errors' => $errors,
                    ];
                    return response()->json($response, $this->successStatus);
                }
                $menu = new Menu();
                $menu->parent_id = $request->parent;
                $menu->title = $request->name;
                $menu->depth = $request->depth;
                $menu->status = 1;
                $menu->save();
                $response = [
                    'status' => true,
                    'message' => 'Menu added successfully.',
                ];

                return response()->json($response, $this->successStatus);
               
        } catch (Exception $ex) {
            $response = ['status' => false, 'message' => $ex];
            return response()->json($response, $this->internalServerStatus);
        }
    }

    public function updateMenu(Request $request){
        try {
            $rules = [
                'id' => 'required|integer',
                'name' => 'string|max:250',
                'parent' => 'integer',
                'depth' => 'integer',
            ];
            $validator = Validator::make($request->all(), $rules, []);
            if ($validator->fails()) {
                $errors = $validator->errors();
                $response = [
                    'status' => false,
                    'message' => $errors->first(),
                    'errors' => $errors,
                ];
                return response()->json($response, $this->successStatus);
            }
            $menu = Menu::where('id',$request->id)->where('status','1')->first();
            if(!empty($menu)){
                if($request->has('name')){
                    $menu->title = $request->name;
                }
                if($request->has('parent')){
                    $menu->parent_id = $request->parent;
                }
                if($request->has('depth')){
                    $menu->depth = $request->depth;
                }
                $menu->save();
                $response = ['status' => true, 'message' => 'Menu updated successfully.'];
            } else {
                $response = ['status' => false, 'message' => 'Menu not found!'];
            }
            
            return response()->json($response, $this->successStatus);

        } catch (\Exception $ex) {
            $response = ['status' => false, 'message' => $ex];
            return response()->json($response, $this->internalServerStatus);
        }
    }

    public function deleteMenu($id, Request $request){
        try {
           
            $menu = Menu::where('id',$id)->where('status','1')->first();
            if(!empty($menu)){
                $menu->delete();
                $response = ['status' => true, 'message' => 'Menu removed successfully.'];
            } else {
                $response = ['status' => false, 'message' => 'Menu not found!'];
            }
            
            return response()->json($response, $this->successStatus);

        } catch (\Exception $ex) {
            $response = ['status' => false, 'message' => $ex];
            return response()->json($response, $this->internalServerStatus);
        }
    }
}

