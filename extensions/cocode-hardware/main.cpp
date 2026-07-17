#include <iostream>
#include <string>
#include <thread>
#include <chrono>
#include <fstream>
#include <sstream>
#include <vector>

#ifdef _WIN32
#include <windows.h>
#else
#include <sys/sysinfo.h>
#include <sys/types.h>
#include <unistd.h>
#endif

using namespace std;

string getMemoryInfo() {
    #ifdef _WIN32
        MEMORYSTATUSEX status; status.dwLength = sizeof(status);
        GlobalMemoryStatusEx(&status);
        return to_string(status.ullTotalPhys / 1024 / 1024);
    #else
        struct sysinfo info;
        if (sysinfo(&info) == 0) return to_string(info.totalram * info.mem_unit / 1024 / 1024);
        return "0";
    #endif
}

string getCPUCount() {
    return to_string(thread::hardware_concurrency());
}

// Simulación de carga de CPU para el ejemplo (en Linux real leeríamos /proc/stat)
string getCPUUsage() {
    #ifdef _WIN32
        return "Not implemented for Win yet";
    #else
        static long double lastSum = 0, lastIdle = 0;
        long double a[10];
        ifstream file("/proc/stat");
        string line;
        getline(file, line);
        stringstream ss(line);
        string cpu; ss >> cpu;
        for(int i=0; i<10; i++) ss >> a[i];
        file.close();

        long double idle = a[3];
        long double sum = 0;
        for(int i=0; i<10; i++) sum += a[i];

        long double diffSum = sum - lastSum;
        long double diffIdle = idle - lastIdle;
        lastSum = sum; lastIdle = idle;

        return to_string(100.0 * (diffSum - diffIdle) / diffSum);
    #endif
}

int main() {
    string line;
    while (getline(cin, line)) {
        if (line == "getMemory") {
            cout << "{\"event\": \"memoryInfo\", \"data\": \"" << getMemoryInfo() << " MB\"}" << endl;
        } else if (line == "getCPU") {
            cout << "{\"event\": \"cpuInfo\", \"data\": {\"cores\": " << getCPUCount() << ", \"usage\": \"" << getCPUUsage() << "\"}}" << endl;
        } else if (line == "ping") {
            cout << "{\"event\": \"pong\", \"data\": \"C++ Extreme Bridge Active\"}" << endl;
        } else if (line == "exit") {
            break;
        }
    }
    return 0;
}
